"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME     = 'forest-cave-lair_clue';
const ACTION_CONTINUE_ON = 'go_inside';

/**
 * A clue as to how to discover the dragon's lair.
 */
class LairClueEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("As you stumble around in the dark, you feel a cool draft of air across your face.  Try as you might, however, you can't seem to locate the source.  _If only you had some light..._"),
      actions: Actions.oneButton(__("Continue on"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CONTINUE_ON } })
    });
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

    if (ACTION_CONTINUE_ON === action) {
      title = __(":white_check_mark: Disappointed, you continue on.");
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

module.exports = LairClueEncounter;