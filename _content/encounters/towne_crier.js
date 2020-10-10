"use strict";

const { Actions, Attachments, Dialog }              = require('slacksimple');
const { Encounter }                                 = require('@app/content/encounters');
const CrierMessages                                 = require('@app/crierMessages');
const { STD_DELAY, COLORS, CHARACTER_STATE, STATS } = require('@constants');

const COMMAND_NAME = 'encounter';

const ENCOUNTER_NAME     = 'towne_crier';
const ACTION_NOPE        = 'nope';
const ACTION_SHOW_DIALOG = 'show_dialog';
const ACTION_DIALOG      = 'dialog_submission';

const MAX_MESSAGE_LENGTH = 150;
const MESSAGE_GOLD_COST = 25;

/**
 * The towne crier, who will parrot your message for 25 gold.
 */
class TowneCrierEncounter extends Encounter {
  constructor() {
    super({
      type: 'towne_crier',
      description: "\"Hear ye, hear ye!\" the Towne Crier calls.  \"The following proclamations have recently been made!\"\n",
    });
  }

  /**
   * Load any extra information required to display this encounter.
   *
   * @param {Character} character - The character to load the inventory for.
   */
  async loadExtra(character) {
    this.messages = await CrierMessages.load(character.connection);
  }

  /**
   * Towne crier
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/towne_crier.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return ": Towne Crier";
  }

  /**
   * Get the description for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = this._description;

    this.messages.forEach(message => {
      description += `> "${message.text}" - ${message.name}\n`;
    });

    description += "*\"Only twenty-five gold to leave a message for all to hear!*";

    return description;
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

    const style = character.gold >= MESSAGE_GOLD_COST ? 'primary' : 'danger';

    actions.addButton(
      `Buy Message (${MESSAGE_GOLD_COST}g)`,
      COMMAND_NAME,
      {
        style,
        confirm: {
          title: `Spend ${MESSAGE_GOLD_COST} gold to leave a message?`,
          text: `Leaving a message with the Towne Crier costs ${MESSAGE_GOLD_COST} gold and will leave your message for all to see, along with your name.`,
          ok_text: "Buy Message",
          dismiss_text: "Nevermind"
        },
        params: {
          type: ENCOUNTER_NAME,
          action: ACTION_SHOW_DIALOG
        }
      }
    );
    actions.addButton("No thanks", COMMAND_NAME, { params: { type: ENCOUNTER_NAME,  action: ACTION_NOPE } });

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
    if (ACTION_SHOW_DIALOG === action) {
      this.showDialog(character, message);
    }
    else if (ACTION_NOPE === action) {
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
   * Show dialog to request message to leave.
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  showDialog(character, message) {
    if (character.gold < MESSAGE_GOLD_COST) {
      return this.updateLast({
        attachments: Attachments.one({
          title: "You don't have the 25 gold required to leave a message.",
          color: COLORS.WARNING
        }),
        doLook: true,
      });
    }

    let dialog = new Dialog('Write a message', character.token);
    dialog.addTextElement('Your message', 'message');

    character.slashbot.dialog(
      this.triggerId,
      character,
      dialog,
    );
  }

  /**
   * User has submitted dialog, wants to buy a message.
   *
   * @param {Character} character - The character performing the action.
   */
  async submitDialog(character) {
    const text = this.info.values.message;

    if (text.length > MAX_MESSAGE_LENGTH) {
      character.slashbot.say('', character, {
        attachments: Attachments.one({
          title: `Your message must not exceed ${MAX_MESSAGE_LENGTH} characters in length.`,
          color: COLORS.DANGER
        }),
      });
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
      return;
    }
    else if (text.length === 0) {
      character.slashbot.say('', character, {
        attachments: Attachments.one({
          title: "What, you don't wanna say anything after all?",
          color: COLORS.DANGER
        }),
      });
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
      return;
    }

    character.gold -= MESSAGE_GOLD_COST;
    character.increaseStat(STATS.CRIER_MESSAGES_PURCHASED);

    await CrierMessages.add(text, character);
    this.messages.unshift({
      text,
      name: character.getDisplayName(),
    });

    character.track("Crier Message Purchased");
    character.track('Premium Purchase', {
      type: 'crier_message',
      quantity: 1
    });

    character.slashbot.say('', character, {
      attachments: Attachments.one({
        title: "You give the Towne Crier your gold and he listens to your message, nods, and begins to repeat it to all who pass by.",
        color: COLORS.GOOD
      }),
    });
    character.slashbot.doCommand('look', character, { delay: STD_DELAY });
  }
}

module.exports = TowneCrierEncounter;