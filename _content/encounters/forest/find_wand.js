"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Items       = require('@app/content/items').Items;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME    = 'forest-find_wand';
const ACTION_PICK_IT_UP = 'pick_it_up';

/**
 * Find a wand in the forest.
 */
class FindWandEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("While walking through the forest, you come across a simple wooden wand lying on the ground, dropped by a careless magician.  It doesn't look powerful or anything, but hey, free wand!"),
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
    return 'encounters/tyrose/find_wand.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": A free wand!");
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
      title = __("You pick it up and wave it around a little to test it out.  Tiny sparks fizzle out of the end, but that's the extent of your abilities.  Perhaps the hermit in the hut in the forest would be able to teach you how to use it?");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.track('Find Wand');

    const simpleWand = Items.new('equipment-relics-001_simple_wand');
    simpleWand.equipTo(character);
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = FindWandEncounter;