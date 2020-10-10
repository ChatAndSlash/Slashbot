"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME       = 'watermoon-rumble-placeholder_intro';
const ACTION_CHALLENGE_THEM = 'challenge_them';

/**
 * Intro encounter for Shadow.
 */
class ShadowIntroEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You enter the Warehouse, only to see goons press in from all sides, one saying \"Nobody gets in to see da boss without goin' through us first.\""),
      actions: Actions.oneButton(__("Challenge them!"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CHALLENGE_THEM } } )
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
    return 'encounters/watermoon/placeholder.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": ???");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_CHALLENGE_THEM === action) {
      const title = __("You flail your weapon in front of you, causing your enemies to back up and give you a bit of breathing space, then turn and engage the first of many opponents!");

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

module.exports = ShadowIntroEncounter;