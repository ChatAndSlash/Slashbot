"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME    = 'forest-cave-pet_collar';
const ACTION_PICK_IT_UP = 'pick_it_up';

/**
 * Find a pet collar.
 */
class PetCollarEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You step on something hard, but yielding.  You look down and see a collar on the ground."),
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
    return 'encounters/tyrose/collar.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Pet Collar");
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
      title = __('You pick up the pet collar, and notice it has the name "Honey" inscribed on it. Maybe Karl at Karl\'s Kats would be interested in this?');
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.track('Find Pet Collar');

    character.inventory.add('quest-pet_collar');
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = PetCollarEncounter;