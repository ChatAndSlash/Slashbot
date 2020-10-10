"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME       = 'watermoon-rumble-shadow_greater_intro';
const ACTION_CHALLENGE_HIM = 'challenge_him';

/**
 * Intro encounter for Shadow.
 */
class ShadowIntroEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You begin crossing the Yard, only to be accosted by a tremendously buff man in a barely-fitting, tightly-belted black robe.  \"Hey!\" he shouts.  \"I've been training!\""),
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
    return 'encounters/watermoon/shadow-2.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Shadow The Great");
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
      const title = __("He holds up a hand as you approach.  \"Ah ah ah.  You wanna fight the new and improved Shadow The Great?  You gotta prove yourself first.\"  With that, he leaves, as one of your first challenges approaches.");

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