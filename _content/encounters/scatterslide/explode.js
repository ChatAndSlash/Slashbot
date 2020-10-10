"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

const ENCOUNTER_NAME = 'scatterslide-explode';
const ACTION_EXPLODE = 'explode';
const ACTION_CANCEL  = 'cancel';

const ITEM_CRUDE_EXPLOSIVE = 'quest-crude_explosive';

const REQUIRED_CRUDE_EXPLOSIVES = 35;

/**
 * Explode the quarry/mine connection.
 */
class ExplodeEncounter extends Encounter {
  constructor() {
    super({
      description: __("You stand in front of the cave-in blocking you from progressing beyond the quarry.\n\n"),
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Get the title to display for the character's current state.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getTitle(character) {
    const remaining = REQUIRED_CRUDE_EXPLOSIVES - character.inventory.quantity(ITEM_CRUDE_EXPLOSIVE);

    return character.inventory.has(ITEM_CRUDE_EXPLOSIVE, REQUIRED_CRUDE_EXPLOSIVES)
      ? __("You judge you finally have enough explosives to blast it open.")
      : __("You still need to collect %d more explosives to open this.", remaining);
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

    if (character.inventory.has(ITEM_CRUDE_EXPLOSIVE, REQUIRED_CRUDE_EXPLOSIVES)) {
      actions.addButton(__("Blow it open"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_EXPLODE } } );
      actions.addButton(__("Not yet"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CANCEL } } );
    }
    else {
      actions.addButton(__("Okay"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CANCEL } } );
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

    if (ACTION_EXPLODE === action) {
      title = this.doExplode(character);
    }
    else if (ACTION_CANCEL === action) {
      title = this.doCancel(character);
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

  /**
   * Explode your way into the mines.
   *
   * @param {Character} character - The character exploding their way into the mines.
   *
   * @return {string}
   */
  doExplode(character) {
    character.track('Explode Quarry Entrance');

    character.inventory.remove(ITEM_CRUDE_EXPLOSIVE, REQUIRED_CRUDE_EXPLOSIVES);
    character.setFlag(FLAGS.QUARRY_BLOWN_UP);
    return __("You pile up all your gathered explosives, back up to a safe distance, and toss a flame.  The explosives go off instantly, sending rocks flying everywhere.  When the dust settles, you can see a clear entrance into the mines.");
  }

  /**
   * Nevermind.
   *
   * @param {Character} character - The character cancelling.
   *
   * @return {string}
   */
  doCancel(character) {
    return __("You decide to come back later when you're ready to progress.");
  }
}

module.exports = ExplodeEncounter;