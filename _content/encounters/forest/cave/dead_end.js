"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

const ENCOUNTER_NAME   = 'forest-cave-dead_end';
const ACTION_GO_DEEPER = 'go_deeper';


/**
 * A dead end in the cave.
 */
class DeadEndEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      actions: Actions.oneButton(__('Go deeper...'), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_GO_DEEPER } } )
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
    return 'encounters/tyrose/dead_end.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": A Dead End");
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    switch (character.getFlag(FLAGS.CAVE_DEAD_ENDS_COUNT, 0)) {
      case 0: return __("You round a corner only to find a dead end.  You'll have to move deeper into the cave to find the lair of the Green Dragon.");
      case 1: return __("Your torch flickers, and when the light steadies you find yourself facing a dead end.  Nothing else for it except to turn around, backtrack, and go deeper into the cave.");
      case 2: return __("You duck under an overhanging stalactite and come face to face with a wall of rock.  Another dead end!  There are only a few more paths to explore left in this cave, but they're all much deeper than any of the others.");
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
    if (ACTION_GO_DEEPER !== action) {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;
    character.incrementFlag(FLAGS.CAVE_DEAD_ENDS_COUNT);

    await this.updateLast({
      attachments: Attachments.one({
        title: __("You retrace your steps to the last fork you discovered and take the other path, heading deeper into the cave."),
      }),
      doLook: true
    });
  }
}

module.exports = DeadEndEncounter;