"use strict";

const Mailchimp                                            = require('mailchimp-api-v3');
const moment                                               = require('moment');
const { Actions, Attachments, Dialog }                     = require('slacksimple');
const { Encounter }                                        = require('@app/content/encounters');
const { STD_DELAY, COLORS, CHARACTER_STATE, STATS, FLAGS } = require('@constants');
const { MAILCHIMP_API_KEY, MAILCHIMP_NEWSLETTER_ID }       = process.env;

const COMMAND_NAME = 'encounter';

const ENCOUNTER_NAME     = 'greeter';
const ACTION_YES         = 'yes';
const ACTION_MAYBE       = 'maybe';
const ACTION_NO          = 'no';
const ACTION_DIALOG      = 'dialog_submission';

const MAX_EMAIL_LENGTH = 150;

const COUNT_DRAGON_SCALES = 5;
const COUNT_CRYSTAL_ACID = 10;

const ERROR_MEMBER_EXISTS = 'Member Exists';

/**
 * The greeter, who offers you a Welcome Kit in exchange for signing up for our newsletter.
 */
class GreeterEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      title: 'Do you want to join our mailing list and get this wonderful Welcome Basket?',
    });

    this.mailchimp = new Mailchimp(MAILCHIMP_API_KEY);
  }

  /**
   * Cowled, purple robed figure.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/greeter.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return ": Greeter";
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    const gold = this.getGold(character);

    return `"Hey!  You there!" you hear from behind you.  You turn and see an enthusiastic-looking man with a wide grin.  "Yes you!" he says cheerfully.  "Welcome to the world of Chat & Slash!  I've been sent here to greet you and ask if you'd like regular email updates about the game!  In return, I'm prepared to offer you a wonderful welcome package!"  He gestures to the basket he's carrying, which contains:\n>- ${COUNT_DRAGON_SCALES}x Dragon Scales\n>- ${COUNT_CRYSTAL_ACID}x Crystal Acid\n>- ${gold} Gold\n\n"If you're interested, we'll only contact you with news about the game, never spam, and we'll never sell or give away your email address to third parties!"`;
  }

  /**
   * Get the amount of gold rewarded in the welcome kit.
   *
   * @param {Character} character - The character to get the gold for.
   *
   * @return {integer}
   */
  getGold(character) {
    return character.level * 50;
  }

  /**
   * Get the action buttons for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {array}
   */
  getActions(character) {
    let actions = new Actions();

    actions.addButton(
      "Yes, definitely!",
      COMMAND_NAME,
      {
        style: 'primary',
        params: {
          type: ENCOUNTER_NAME,
          action: ACTION_YES
        }
      }
    );
    actions.addButton(
      "Maybe later...",
      COMMAND_NAME,
      {
        params: {
          type: ENCOUNTER_NAME,
          action: ACTION_MAYBE
        }
      }
    );
    actions.addButton(
      "No thanks",
      COMMAND_NAME,
      {
        params: {
          type: ENCOUNTER_NAME,
          action: ACTION_NO
        }
      }
    );

    return actions;
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_YES === action) {
      this.showDialog(character, message);
    }
    else if (ACTION_MAYBE === action) {
      // Add back the AP this encounter cost
      character.ap = Math.min(character.ap + 1, character.maxAp);

      // Show greeter again in a week
      character.setFlag(FLAGS.GREETER_DELAY_UNTIL, moment().add(7, 'days'));

      character.state = CHARACTER_STATE.IDLE;
      await this.updateLast({
        attachments: Attachments.one({
          title: "You leave the Towne Crier for now, promising to reconsider his message later.",
        }),
        doLook: true
      });
    }
    else if (ACTION_NO === action) {
      // Never show greeter again
      character.setStat(STATS.GREETER_COMPLETED);
      character.clearFlag(FLAGS.GREETER_DELAY_UNTIL);

      // Add back the AP this encounter cost
      character.ap = Math.min(character.ap + 1, character.maxAp);

      character.state = CHARACTER_STATE.IDLE;
      await this.updateLast({
        attachments: Attachments.one({
          title: "You leave the Towne Crier to spread his message.",
        }),
        doLook: true
      });
    }
    else if (ACTION_DIALOG === action) {
      await this.submitDialog(character, message);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }
  }

  /**
   * Add an email address to the newsletter.
   */
  async addToNewsletter(email) {
    try {
      await this.mailchimp.post(`/lists/${MAILCHIMP_NEWSLETTER_ID}/members`, {
        email_address: email,
        status: 'pending',
        merge_fields: {
          MMERGE3: 'Greeter Encounter',
        },
      });
    }
    catch (error) {
      // Ignore email already being on newsletter, that's totally fine
      if (ERROR_MEMBER_EXISTS !== _.get(error, 'title', '')) {
        throw error;
      }
    }
  }

  /**
   * Show dialog to request email address.
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  showDialog(character, message) {
    let dialog = new Dialog('Enter your email address', character.token);
    dialog.addTextElement('Your email address', 'email', {
      subtype: 'email',
      placeholder: 'you@example.com',
    });

    character.slashbot.dialog(
      this.triggerId,
      character,
      dialog,
    );
  }

  /**
   * User has submitted dialog, wants to sign up for newsletter.
   *
   * @param {Character} character - The character performing the action.
   */
  async submitDialog(character) {
    const email = this.info.values.email;

    if (email.length > MAX_EMAIL_LENGTH) {
      character.slashbot.say('', character, {
        attachments: Attachments.one({
          title: `Your email address must not exceed ${MAX_EMAIL_LENGTH} characters in length.`,
          color: COLORS.DANGER
        }),
      });
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
      return;
    }
    else if (email.length === 0) {
      character.slashbot.say('', character, {
        attachments: Attachments.one({
          title: "You need to enter *something* as your email address.",
          color: COLORS.DANGER
        }),
      });
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
      return;
    }

    character.state = CHARACTER_STATE.IDLE;

    await this.addToNewsletter(email);

    character.inventory.add('catalyst-crystal_acid', COUNT_CRYSTAL_ACID);
    character.scales += COUNT_DRAGON_SCALES;
    character.gold += this.getGold(character);

    character.track('Newsletter Signup');

    // Never show greeter again
    character.setStat(STATS.GREETER_COMPLETED);
    character.clearFlag(FLAGS.GREETER_DELAY_UNTIL);

    // Add back the AP this encounter cost
    character.ap = Math.min(character.ap + 1, character.maxAp);

    character.slashbot.say('', character, {
      attachments: Attachments.one({
        title: "\"Great!\" the Greeter says.  \"You'll find a message in your inbox where you can confirm your newsletter signup, and if you check your inventory, you'll see that while you were busy writing, I've already given you your welcome kit!  Hope you have fun!\"  With that, he turns and moseys off, leaving you to your business.",
        color: COLORS.GOOD
      }),
    });
    character.slashbot.doCommand('look', character, { delay: STD_DELAY });
  }
}

module.exports = GreeterEncounter;