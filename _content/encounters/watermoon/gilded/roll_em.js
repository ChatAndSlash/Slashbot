"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Random      = require('@util/random');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;
const STATS           = require('@constants').STATS;

const ENCOUNTER_TYPE = 'watermoon-gilded-roll_em';

const ACTION_PLAY = 'play';
const ACTION_NEVERMIND = 'nevermind';

/**
 * Play (and lose) Roll 'Em!
 */
class RollEmEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_TYPE,
      description: __('You sit down at the Roll \'Em table and the dealer sets a pair of dice in front of you.  "You and I each roll the dice.  Whoever\'s higher wins.  5 gold.  You ready to play?"'),
    });
  }

  /**
   * Get the image for this encounter.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/watermoon/roll_em.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Roll 'Em");
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

    actions.addButton(__("Play!"), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_PLAY } });
    actions.addButton(__("Nevermind..."), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_NEVERMIND } });

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
    let title = '';
    let color = '';

    if (ACTION_PLAY === action) {
      character.gold -= 5;
      character.increaseStat(STATS.CASINO_GAMES_PLAYED, 1, ENCOUNTER_TYPE);

      let yourFirst = Random.between(1, 6);
      let yourSecond = Random.between(1, 5);

      let dealerFirst = Random.between(yourFirst, 6);
      let dealerSecond = Random.between(yourSecond + 1, 6);

      title = __("You pay your 5 gold bet and roll your dice:\n\nA %d and a %d.\n\nThe dealer snorts, and rolls their dice:\n\nA %d and a %d.\n\n\"Tough luck,\" he says.", yourFirst, yourSecond, dealerFirst, dealerSecond);

      color = COLORS.DANGER;
    }
    else if (ACTION_NEVERMIND === action) {
      title = __("You decide to check out the other games.");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title, color }),
      doLook: true
    });
  }
}

module.exports = RollEmEncounter;