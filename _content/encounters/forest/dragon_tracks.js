"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

const ENCOUNTER_NAME     = 'forest-dragon_tracks';
const ACTION_FOLLOW_THEM = 'follow_them';


/**
 * Find dragon tracks in the forest.
 */
class DragonTracksEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      actions: Actions.oneButton(__('Follow them!'), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_FOLLOW_THEM } } )
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
    return 'encounters/tyrose/dragon_tracks.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Dragon tracks...");
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    switch (character.getFlag(FLAGS.FOREST_DRAGON_TRACKS_COUNT, 0)) {
      case 0: return __("You push aside a bush to step past it, and reveal deep claw and tail slide marks.  The unmistakeable tracks of a dragon!");
      case 1: return __("You nearly stumble over another set of dragon tracks, carved deep into the earth.");
      case 2: return __("Now knowing what you're looking for, you easily identify another set of dragon tracks.  You're drawing closer to the dragon's lair!");
      case 3: return __("Your eagle eyes spot a set of dragon tracks on the other side of a copse of trees.  They're clear and unobstructed.  The dragon's lair must be nearby!");
    }
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_FOLLOW_THEM !== action) {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;
    character.incrementFlag(FLAGS.FOREST_DRAGON_TRACKS_COUNT);

    await this.updateLast({
      attachments: Attachments.one({
        title: __("You make note of the direction the tracks are headed, and follow them carefully."),
      }),
      doLook: true
    });
  }
}

module.exports = DragonTracksEncounter;