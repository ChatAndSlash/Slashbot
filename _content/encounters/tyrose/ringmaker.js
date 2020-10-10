"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Items       = require('@app/content/items').Items;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_TYPE = 'tyrose-ringmaker';

const ACTION_RETURN_TOOLS = 'learn';
const ACTION_OKAY = 'okay';

/**
 * The hermit in the hut teaches you some magic!
 */
class RingmakerEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_TYPE,
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
    return 'encounters/tyrose/ringmaker.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Sad Ringmaker");
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    if (character.inventory.has('quest-ringmakers_tools')) {
      return __("The ringmaker's face lights up as you approach, tools in hand.");
    }
    else {
      return __('The ringmaker turns you away.  "I\'m sorry," he says.  "But I can\'t craft or fit any rings for you without my tools."');
    }
  }

  /**
   * Get the action buttons for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {array}
   */
  getActions(character) {
    let actions = new Actions();

    if (character.inventory.has('quest-ringmakers_tools')) {
      actions.addButton(__("Return tools"), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_RETURN_TOOLS } });
    }
    else {
      actions.addButton(__("Okay..."), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_OKAY } });
    }

    return actions;
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

    if (ACTION_RETURN_TOOLS === action) {
      title = __("You return the tools to the ringmaker, and in gratitude, he quickly crafts and sizes a simple, yet useful ring for you.  It adds +5 to your Max HP!");
      const starterRing = Items.new('equipment-accessories-001_starter_ring');
      starterRing.equipTo(character);
      character.inventory.remove('quest-ringmakers_tools');
    }
    else if (ACTION_OKAY === action) {
      title = __("You vow to keep an eye out for the ringmaker's tools.");
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

module.exports = RingmakerEncounter;