"use strict";

const Locations   = require('@app/content/locations').Locations;
const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const FLAGS           = require('@constants').FLAGS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME   = 'forest-cave-discover_lair';
const ACTION_GO_INSIDE = 'go_inside';
const ACTION_GO_BACK   = 'go_back';

const NUM_CRYSTALS = 6;

/**
 * From the cave, you discover the lair.
 */
class DiscoverLairEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Go inside"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_GO_INSIDE } });
    actions.addButton(__("Go back"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_GO_BACK } });

    super({
      type: ENCOUNTER_NAME,
      description: __("Your torch held high, you round a corner, only to be stopped as you notice a cool draft of air on your face.  You follow it and find a cleverly-hidden path you would have missed without light to see by.  You've found the *Green Dragon*'s lair.\n\nYou find: `%dx Crystal Acid` nearby.", NUM_CRYSTALS),
      actions
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

    if (ACTION_GO_INSIDE === action) {
      title = this.goInside(character);
    }
    else if (ACTION_GO_BACK === action) {
      title = this.goBack(character);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.inventory.add('catalyst-crystal_acid', NUM_CRYSTALS);

    character.track('Discover Lair');

    character.clearFlag(FLAGS.CAVE_DISCOVER_LAIR_CHANCE);
    character.setFlag(FLAGS.GREEN_LAIR_DISCOVERED);
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Go inside the lair.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  goInside(character) {
    character.location = Locations.new('tyrose-forest-cave-lair');

    return __(":white_check_mark: You pick up the Crystal Acid and head inside.  You can now Travel here from the Cave.");
  }

  /**
   * Don't... go inside the lair.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  goBack(character) {
    return __(":white_check_mark: You pick up the Crystal Acid and head back to the Cave.  You can always Travel to the lair later from the Cave.");
  }
}

module.exports = DiscoverLairEncounter;