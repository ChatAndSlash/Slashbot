"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Text        = require('@util/text');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

const ENCOUNTER_NAME = 'scatterslide-repair';
const ACTION_REPAIR  = 'repair';
const ACTION_CANCEL  = 'cancel';

const ITEM_INTACT_GEAR = 'quest-intact_gear';

const REQUIRED_INTACT_GEARS = 25;

/**
 * Repair the elevator leading further into the mine.
 */
class RepairEncounter extends Encounter {
  constructor() {
    super({
      description: __("The elevator that leads further into the depths of the mine is before you, its broken gearbox open on the side.\n\n"),
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
    const remaining = REQUIRED_INTACT_GEARS - character.inventory.quantity(ITEM_INTACT_GEAR);
    const object = Text.pluralize("gear", remaining);

    return (character.inventory.has(ITEM_INTACT_GEAR, REQUIRED_INTACT_GEARS))
      ? __("You should have enough gears to swap out the broken pieces in the gearbox.")
      : __("You'll need to collect %d more %s to repair the elevator.", remaining, object);
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

    if (character.inventory.has(ITEM_INTACT_GEAR, REQUIRED_INTACT_GEARS)) {
      actions.addButton(__("Repair it"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_REPAIR } } );
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

    if (ACTION_REPAIR === action) {
      title = this.doRepair(character);
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
   * Repair the elevator.
   *
   * @param {Character} character - The character repairing the elevator.
   *
   * @return {string}
   */
  doRepair(character) {
    character.track('Repair Mine Elevator');

    character.inventory.remove(ITEM_INTACT_GEAR, REQUIRED_INTACT_GEARS);
    character.setFlag(FLAGS.MINE_ELEVATOR_FIXED);
    return __("You sit down with your bag of gears and carefully start replacing the broken ones from the gearbox.  Thankfully, no creepy-crawlies decide to interrupt you and you finish in good time.  You throw the switch on the side of the elevator and it rumbles into life.");
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

module.exports = RepairEncounter;