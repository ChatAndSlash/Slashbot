"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Random      = require('@util/random');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STATS           = require('@constants').STATS;

const ENCOUNTER_NAME = "scatterslide-leaky_canteen";
const ACTION_DRINK   = "drink";
const ACTION_LEAVE   = "leave";

/**
 * Encounter a leaky canteen that may harm or heal.
 */
class LeakyCanteenEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Drink it"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_DRINK } });
    actions.addButton(__("Leave"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE } });

    super({
      type: ENCOUNTER_NAME,
      description: __("You find a discarded pack, empty of anything except a leaky canteen.  It has a viscous green liquid in it that smells strongly of alcohol and herbs.  Do... Do you want to drink it?  Hurry up and decide, it's leaking everywhere!"),
      actions
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
    return 'encounters/scatterslide/leaky_canteen.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Leaky Canteen");
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

    if (ACTION_DRINK === action) {
      // Poison!
      if (Random.between(1, 4) == 1) {
        // Do 10 damage, but leave at least 1 HP
        const damage = character.hp > 10 ? 10 : character.hp - 1;
        character.decreaseHp(damage);

        title = __("You guzzle greedily from the canteen, the liquid tickling your throat a little on the way down.  The tickle turns into a burn in your stomach, and you violently sick up the vile stuff.  You lose %d HP.", damage);
      }
      // Full heal and then some!
      else {
        character._hp = character.maxHp + 10;

        title = __("You sip hesitantly from the canteen, but the liquid is cool and refreshing.  You gain back all your HP and then some!");
      }

      character.increaseStat(STATS.LEAKY_CANTEEN, 1);
    }
    else if (ACTION_LEAVE === action) {
      title = __("Discretion being the better part of valour, you leave the canteen behind.");
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
}

module.exports = LeakyCanteenEncounter;