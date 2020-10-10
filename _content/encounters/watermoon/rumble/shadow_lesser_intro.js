"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME       = 'watermoon-rumble-shadow_lesser_intro';
const ACTION_CHALLENGE_HIM = 'challenge_him';

/**
 * Intro encounter for Shadow.
 */
class ShadowIntroEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You begin strolling down the Laneway, only to be accosted by a scrawny man in a loosely-belted black robe.  \"Hey!\" he shouts.  \"You're not part of my gang!  How dare you enter the territory of Shadow The Great without permission!  What are you doing here?\""),
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
    return 'encounters/watermoon/shadow-1.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Shadow \"The Great\"");
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
      const title = __("He jumps back as you step forward.  \"What the?  That's not how this is done!  Look, you wanna fight me, you uh, you gotta beat up, like, 100 of my gang first, okay?  I'll...  I'll be waiting!\"\n\nWith that, he runs off, and you're approached by your first of many gang members.");

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