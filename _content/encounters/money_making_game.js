"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Random      = require('@util/random');
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STATS         = require('@constants').STATS;

const COMMAND_NAME = 'encounter';

const ACTION_PLAY_1   = 'play_1';
const ACTION_PLAY_10  = 'play_10';
const ACTION_PLAY_100 = 'play_100';
const ACTION_NOPE     = 'nope';

/**
 * A money-making game!
 */
class MoneyMakingGameEncounter extends Encounter {
  constructor() {
    super({
      type: 'money_making_game',
      description: __('You come across a hooded figure who addresses you in a low voice:\n\n"Hey. Wanna play a money-making game?"'),
    });
  }

  /**
   * Cowled, purple robed figure.
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
    return __(": Money Making Game!");
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

    if (character.gold >= 1) {
      actions.addButton(__("%d gold", 1), COMMAND_NAME, { params: { action: ACTION_PLAY_1 } });

      if (character.gold >= 10) {
        actions.addButton(__("%d gold", 10), COMMAND_NAME, { params: { action: ACTION_PLAY_10 } });

        if (character.gold >= 100) {
          actions.addButton(__("%d gold", 100), COMMAND_NAME, { params: { action: ACTION_PLAY_100 } });
        }
      }
    }

    actions.addButton(__("No thanks"), COMMAND_NAME, { params: { action: ACTION_NOPE } });

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

    if (ACTION_PLAY_1 === action) {
      title = this.play(character, 1);
      character.increaseStat(STATS.MONEY_MAKING_GAME, 1, 'played_1');
    }
    else if (ACTION_PLAY_10 === action) {
      title = this.play(character, 10);
      character.increaseStat(STATS.MONEY_MAKING_GAME, 1, 'played_10');
    }
    else if (ACTION_PLAY_100 === action) {
      title = this.play(character, 100);
      character.increaseStat(STATS.MONEY_MAKING_GAME, 1, 'played_100');
    }
    else if (ACTION_NOPE === action) {
      title = __("You decide not to take any extra chances today, and walk away from the shady figure.");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Play the game!
   *
   * @param {Character} character - The character playing the game.
   * @param {integer} wagered - The amount being wagered.
   *
   * @return string
   */
  play(character, wagered) {
    let title = __(":game_die: You hand over %d gold, and accept a small bag from the figure.  Inside is...\n\n", wagered);
    const { type, amount } = Random.getWeighted(this.getChances(wagered));

    if ('nothing' === type) {
      title += __("Nothing!  You look back up to complain, but the hooded figure has already disappeared.");
    }
    else if ('gold' === type) {
      character.gold += amount;

      if (amount >= wagered) {
        title += __("%d gold!  Nice!", amount);
      }
      else {
        title += __("Only %d gold.  Oh well, nothing wagered, nothing gained, right?", amount);
      }
    }
    else if ('acid' === type) {
      character.inventory.add('catalyst-crystal_acid', amount);
      title += __("%d Crystal Acid!  Amazing!", amount);
    }
    else {
      throw new Error(`Invalid result for money making game.  Wagered: '${wagered}'.  Type: '${type}.  Amount: '${amount}.`);
    }

    return title;
  }

  /**
   * Get the chances of winning each reward, based on the amount wagered.
   *
   * @param {integer} wagered - The amount wagered.
   *
   * @return {array}
   */
  getChances(wagered) {
    if (1 === wagered) {
      return [
        { weight: 50, value: { type: 'nothing' } },
        { weight: 30, value: { type: 'gold', amount: Random.between(2, 10) } },
        { weight: 20, value: { type: 'gold', amount: Random.between(10, 20) } },
      ];
    }
    else if (10 === wagered) {
      return [
        { weight: 50, value: { type: 'gold', amount: Random.between(1, 5) } },
        { weight: 40, value: { type: 'gold', amount: Random.between(20, 40) } },
        { weight: 10, value: { type: 'acid', amount: 1 } },
      ];
    }
    else if (100 === wagered) {
      return [
        { weight: 50, value: { type: 'gold', amount: Random.between(10, 50) } },
        { weight: 30, value: { type: 'gold', amount: Random.between(120, 180) } },
        { weight: 20, value: { type: 'acid', amount: Random.between(2, 5) } },
      ];
    }
    else {
      throw new Error(`Uncrecognized wagered amount for ${this.type}: '${wagered}'`);
    }
  }
}

module.exports = MoneyMakingGameEncounter;