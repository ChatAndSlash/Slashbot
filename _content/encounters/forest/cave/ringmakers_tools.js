"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME    = 'forest-cave-ringmakers_tools';
const ACTION_PICK_IT_UP = 'pick_it_up';

/**
 * Find a bag of ringmaker's tools.
 */
class RingmakersToolsEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("So intent on keeping an eye on monsters, you stumble over a rock on the ground.  You go to kick it aside to make sure you don't stumble over it again, when you notice it's actually a small sack.  Opening it, you see that it's a collection of tools that one might use to craft rings.  The ringmaker in town would be delighted to have this returned to him!"),
      actions: Actions.oneButton(__('Pick it up'), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_PICK_IT_UP } } )
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
    return 'encounters/tyrose/bag.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Ringmaker's Tools!");
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

    if (ACTION_PICK_IT_UP === action) {
      title = __("You pick up the bag of tools and resolve to bring it back to the ringmaker in town post-haste.");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.track('Find Ringmakers Tools');

    character.inventory.add('quest-ringmakers_tools');
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = RingmakersToolsEncounter;