"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME       = 'watermoon-rumble-drunken_master_intro';
const ACTION_CHALLENGE_HER = 'challenge_her';

/**
 * Intro encounter for Drunken Master.
 */
class DrunkenMasterEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("At the head of the alleyway, you encounter a red-faced woman who stumbled towards you, slurring out a challenge.  You back away, not desiring to start a fight with an intoxicated person, but as you do, she stumbles, falls, rolls forward, and transfers her momentum into a solid punch to your chest.  You've heard of this!  A true Drunken Master, someone who has turned the supposed disadvantage of massive, massive intoxication into an actual advantage!"),
      actions: Actions.oneButton(__("Challenge her!"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CHALLENGE_HER } } )
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
    return 'encounters/watermoon/drunken_master.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Drunken Master");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_CHALLENGE_HER === action) {
      const title = __("As you attack, she falls over backwards out of the way, and rolls around a corner leaving you to fight one of her minions.");

      // Encounter your first enemy in this location
      const location = character.location;
      character.enemy = location.buildEnemy(character, location.pickRandomEnemy(character));
      character.state = CHARACTER_STATE.FIGHTING;

      await this.updateLast({
        attachments: Attachments.one({ title }),
        doLook: true
      });
    }
    else {
      throw new Error(`Unknown action: ${action}.`);
    }
  }
}

module.exports = DrunkenMasterEncounter;