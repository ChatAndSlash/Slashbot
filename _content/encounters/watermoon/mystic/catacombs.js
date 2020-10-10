"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Text        = require('@util/text');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS = require('@constants').FLAGS;

const ENCOUNTER_NAME = 'watermoon-mystic-catacombs';
const ACTION_ENTER   = 'enter';
const ACTION_LEAVE   = 'leave';

/**
 * Attempt to gain entrance to Catacombs.
 */
class CatacombsEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Alter description based on how deep in the mine the character is.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = __("You approach the entrance to the Catacombs, the home of the terrible and powerful Necrodragon.\n\n");

    if (character.hasFlag(FLAGS.CATACOMBS_OPEN)) {
      description += __("The three Soul Gems rest in their sockets, and the massive door to the Catacombs stands ominously open.");
    }
    else {
      description += __("The massive iron door to the Catacombs stands closed before you, locked away by the magic of the Soul Gems.  Three sockets are arrayed on the ground in front of you, waiting for you to place the Soul Gems into them.");

      if ( ! this.hasCrystals(character)) {
        let requires = [];

        if ( ! character.inventory.has('quest-watermoon-faith_soul_gem')) {
          requires.push(__("*Faith*"));
        }
        if ( ! character.inventory.has('quest-watermoon-shadow_soul_gem')) {
          requires.push(__("*Shadow*"));
        }
        if ( ! character.inventory.has('quest-watermoon-death_soul_gem')) {
          requires.push(__("*Death*"));
        }


        description += __("\n\nYou still require the %s Soul %s.", Text.listify(requires), Text.pluralize("Gem", requires.length));
      }
    }

    return description;
  }

  /**
   * If the character has all the crystals required to open the Catacombs.
   *
   * @param {Character} character - The character to check.
   *
   * @return boolean
   */
  hasCrystals(character) {
    return character.inventory.has('quest-watermoon-faith_soul_gem')
      && character.inventory.has('quest-watermoon-shadow_soul_gem')
      && character.inventory.has('quest-watermoon-death_soul_gem');
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

    const style = character.hasFlag(FLAGS.CATACOMBS_OPEN) || this.hasCrystals(character)
      ? 'default' : 'danger';
    actions.addButton(__("Enter"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_ENTER }, style } );
    actions.addButton(__("Leave"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE } } );

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

    if (ACTION_ENTER === action) {
      title = this.doEnter(character);
    }
    else if (ACTION_LEAVE === action) {
      title = this.doLeave(character);
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
   * Enter the Catacombs.
   *
   * @param {Character} character - The character entering the catacombs.
   *
   * @return {string}
   */
  doEnter(character) {
    const Locations = require('@app/content/locations').Locations;

    if (character.hasFlag(FLAGS.CATACOMBS_OPEN)) {
      character.location = Locations.new("watermoon-mystic-catacombs");

      return __("You pass through the open door and descend into the Catacombs.");
    }
    else if (this.hasCrystals(character)) {
      character.track('Open Catacombs');

      character.inventory.remove('quest-watermoon-faith_soul_gem');
      character.inventory.remove('quest-watermoon-shadow_soul_gem');
      character.inventory.remove('quest-watermoon-death_soul_gem');

      character.setFlag(FLAGS.CATACOMBS_OPEN);
      character.location = Locations.new("watermoon-mystic-catacombs");

      return __("You place each Soul Gem in its socket and watch as the massive door slowly swings open, allowing you to pass through and descend into the Catacombs.");
    }

    return __("You do not have the required Soul Gems to enter.");
  }

  /**
   * Nevermind.
   *
   * @param {Character} character - The character leaving.
   *
   * @return {string}
   */
  doLeave(character) {
    return __("You decide to come back later when you're ready to progress.");
  }
}

module.exports = CatacombsEncounter;