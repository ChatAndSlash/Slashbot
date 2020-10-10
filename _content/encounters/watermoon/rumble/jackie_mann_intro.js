"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME       = 'watermoon-rumble-jackie_mann_intro';
const ACTION_CHALLENGE_HIM = 'challenge_him';

/**
 * Intro encounter for Jackie Mann.
 */
class JackieMannEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("Standing alone in the lot is an average-looking man.  He looks at you unconcernedly."),
      actions: Actions.oneButton(__("Challenge him!"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CHALLENGE_HIM } } )
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
    return 'encounters/watermoon/jackie_mann.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Jackie Mann");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_CHALLENGE_HIM === action) {
      const title = __("After a brief scuffle where you fail to land even a single blow, he dives through a half-open window in a feat of insane agility, and leaves you to first fight through his minions.");

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

module.exports = JackieMannEncounter;