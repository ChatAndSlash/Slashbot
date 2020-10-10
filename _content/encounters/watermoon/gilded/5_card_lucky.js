"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Random      = require('@util/random');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;
const STATS           = require('@constants').STATS;

const ENCOUNTER_TYPE = 'watermoon-gilded-5_card_lucky';

const ACTION_PLAY = 'play';
const ACTION_NEVERMIND = 'nevermind';

/**
 * Play (and lose) 5 Card Lucky!
 */
class FiveCardLuckyEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_TYPE,
      description: __('The 5 Card Lucky dealer looks at you expectantly.  "5 gold?" she asks, arm outstretched to take your bet.'),
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
    return 'encounters/watermoon/5_card_lucky.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": 5 Card Lucky");
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

      let cards = Random.drawCards(5);
      title = __("You pay your 5 gold bet, and the dealer deals you your 5 lucky cards:\n\n%s.\n\n\"Oh no!\" she says.  \"Not lucky!  You lose!\"", cards.join(", "));

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

module.exports = FiveCardLuckyEncounter;