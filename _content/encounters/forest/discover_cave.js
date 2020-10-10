"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Locations   = require('@app/content/locations').Locations;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const FLAGS           = require('@constants').FLAGS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME   = 'forest-discover_cave';
const ACTION_GO_INSIDE = 'go_inside';
const ACTION_GO_BACK   = 'go_back';

const NUM_CRYSTALS = 3;

/**
 * From the forest, you discover the cave.
 */
class DiscoverCaveEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Go inside"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_GO_INSIDE } } );
    actions.addButton(__("Go back"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_GO_BACK } } );

    super({
      type: ENCOUNTER_NAME,
      description: __("Wary of the danger this deep in the forest, you are on high alert.  You notice a copse of bushes with broken branches and gouges in the dirt, and attempt to pass through it as quietly as possible.  On the other side is the entrance to a cave, and a few shards of Crystal Acid on the ground confirm to you that this is where the *Green Dragon*'s lair is.\n\nYou find: `%dx Crystal Acid`.", NUM_CRYSTALS),
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

    character.clearFlag(FLAGS.FOREST_DISCOVER_CAVE_CHANCE);
    character.setFlag(FLAGS.FOREST_CAVE_DISCOVERED);

    character.track('Discover Cave');

    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Go inside the cave.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  goInside(character) {
    character.location = Locations.new('tyrose-forest-cave');

    return __(":white_check_mark: You pick up the Crystal Acid and head inside.  You can now Travel here from the Forest.");
  }

  /**
   * Don't... go inside the cave.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  goBack(character) {
    return __(":white_check_mark: You pick up the Crystal Acid and head back to the Forest.  You can always Travel to the cave later from the Forest.");
  }
}

module.exports = DiscoverCaveEncounter;