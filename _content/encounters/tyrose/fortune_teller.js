"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const getFortune = require('@app/fortune');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STD_DELAY       = require('@constants').STD_DELAY;

const ENCOUNTER_NAME     = 'tyrose-fortune_teller';
const ACTION_BUY_FORTUNE = 'buy_fortune';
const ACTION_CANCEL      = 'cancel';

const PREDICTION_DELAY = 5;

/**
 * Fortune teller.
 */
class FortuneTellerEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __('You approach the fortune teller and she smiles, greeting you.\n\n"Care for some guidance?" she asks.'),
    });
  }

  /**
   * Image of the fortune teller.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/cowled.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Fortune Teller");
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
    actions.addButton(__("Buy Fortune (%d gold)", this.getCost(character)), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_BUY_FORTUNE } } );
    actions.addButton(__("Cancel"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CANCEL } } );
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
    if (ACTION_BUY_FORTUNE === action) {
      await this.buyFortune(character, message);
    }
    else if (ACTION_CANCEL === action) {
      await this.doCancel(character, message);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }
  }

  /**
   * Buy a fortune!
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async buyFortune(character, message) {
    // Clear the encounter state
    character.state = CHARACTER_STATE.IDLE;

    if (character.gold >= this.getCost(character)) {
      character.gold -= this.getCost(character);
      await this.updateLast({
        attachments: Attachments.one({ title: __(":white_check_mark: Got it!") })
      });
      character.slashbot.say(this.getFortune(character), character, { messageDelay: STD_DELAY });
      this.doLook({ delay: PREDICTION_DELAY });
    }
    else {
      await this.updateLast({
        attachments: Attachments.one({
          title: __(":warning: You don't have enough gold."),
        }),
        doLook: true
      });
    }
  }

  /**
   * Don't buy a fortune...
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doCancel(character, message) {
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({
        title: __("You decide not to buy a fortune."),
      }),
      doLook: true
    });
  }

  /**
   * Get the fortune to display for this character.
   *
   * @param {Character} character - The character to get the fortune for
   *
   * @return {string}
   */
  getFortune(character) {
    return __("You hand over %d gold and watch as she pores over a crystal ball.  It lights up briefly, then she looks up to you and speaks:```%s```", this.getCost(character), getFortune(character));
  }

  /**
   * Get the cost for a fortune.
   *
   * @param {Character} character - The character buying a fortune.
   *
   * @return {integer}
   */
  getCost(character) {
    return character.level;
  }
}

module.exports = FortuneTellerEncounter;
