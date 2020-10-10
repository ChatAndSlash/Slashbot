"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Text        = require('@util/text');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

const ENCOUNTER_NAME = 'scatterslide-unlock';
const ACTION_UNLOCK  = 'unlock';
const ACTION_CANCEL  = 'cancel';

const ITEM_CHUNKY_KEY = 'quest-chunky_key';

const REQUIRED_CHUNKY_KEYS = 20;

/**
 * Unlock the giant door in the underdrift.
 */
class UnlockEncounter extends Encounter {
  constructor() {
    super({
      description: __("The gigantic door that bars your progress towers above you.\n\n"),
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
    const remaining = REQUIRED_CHUNKY_KEYS - character.inventory.quantity(ITEM_CHUNKY_KEY);
    const object = Text.pluralize("key", remaining);

    return character.inventory.has(ITEM_CHUNKY_KEY, REQUIRED_CHUNKY_KEYS)
      ? __("You should have enough keys to unlock all the locks on the door.")
      : __("You'll need to collect %d more %s to unlock all these locks.", remaining, object);
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

    if (character.inventory.has(ITEM_CHUNKY_KEY, REQUIRED_CHUNKY_KEYS)) {
      actions.addButton(__("Unlock"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_UNLOCK } } );
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

    if (ACTION_UNLOCK === action) {
      title = this.doUnlock(character);
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
   * Unlock the door.
   *
   * @param {Character} character - The character unlocking the door.
   *
   * @return {string}
   */
  doUnlock(character) {
    character.track('Unlock Underdrift Door');

    character.inventory.remove(ITEM_CHUNKY_KEY, REQUIRED_CHUNKY_KEYS);
    character.setFlag(FLAGS.UNDERDRIFT_DOOR_UNLOCKED);
    return __("You painstakingly try each of your keys against every lock on the door until you find a match for each, and toss the heavy locks to the ground as they open.  When all the locks lie discarded on the floor, you grab the door's handle, brace your foot against the wall, and heave with all your strength.  With a groan, the door opens while the caverns around you rumble.  You can see dust and rocks falling from the ceiling in front of you as the walls shake.");
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

module.exports = UnlockEncounter;