"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Random      = require('@util/random');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;
const STATS           = require('@constants').STATS;

const ENCOUNTER_TYPE = 'watermoon-gilded-top_card';

const ACTION_PLAY = 'play';
const ACTION_NEVERMIND = 'nevermind';

/**
 * Play (and lose) Top Card!
 */
class TopCardEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_TYPE,
      description: __('You sit down at the Top Card table just as the dealer is completing a thrilling shuffle.  "5 gold to play," he says.  "Try your luck?"'),
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
    return 'encounters/watermoon/top_card.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Top Card");
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

      let card = Random.drawCards(1)[0];
      title = __("You pay your 5 gold bet, and the dealer deals you a card off the top of the deck:\n\n%s.\n\n\"Well that's not worth anything,\" he says.", card);

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

module.exports = TopCardEncounter;