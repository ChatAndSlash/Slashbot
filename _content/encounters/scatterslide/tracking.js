"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

const ENCOUNTER_NAME  = 'scatterslide-tracking';
const ACTION_CONTINUE = 'continue';

/**
 * Track down the Brown Dragon.
 */
class TrackingEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You enter a pocket at random, and find it empty.  However, examining it closely, you find a small pile of Quicksalt leading off in a specific direction.  The Brown Dragon was here recently.  You're getting closer."),
      actions: Actions.oneButton(__('Continue'), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CONTINUE } } )
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
    if (ACTION_CONTINUE !== action) {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    const amount = character.getFlag(FLAGS.BROWN_DRAGON_TRACKING, 0) + 1;
    const title = __(
      "You collect the %d Quicksalt you find and move along, drawing closer to the Brown Dragon with every step.",
      amount
    );

    character.inventory.add('catalyst-quicksalt', amount);
    character.setFlag(FLAGS.BROWN_DRAGON_TRACKING, amount);
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = TrackingEncounter;