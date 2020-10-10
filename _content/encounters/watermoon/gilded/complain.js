"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Locations   = require('@app/content/locations').Locations;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;

const ENCOUNTER_TYPE = 'watermoon-gilded-complain';

const ACTION_LEAVE = 'leave';

/**
 * Complain to the management.
 */
class ComplainEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_TYPE,
      description: __('You stalk up to the casino host to complain about the games, but are intercepted by an astoundingly tall and broad woman.  You try to push past her, but she effortlessly holds you at bay.  "I assure you," the host says past her.  "Ours are the fairest games you\'ll find in all of Watermoon.  If they\'re not to your taste, you\'re free to leave.'),
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
    return 'encounters/watermoon/complain.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Complain To The Management");
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

    actions.addButton(__("Leave"), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_LEAVE } });

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
    character.state = CHARACTER_STATE.IDLE;
    character.location = Locations.new('watermoon-gilded-sterling_st');

    await this.updateLast({
      attachments: Attachments.one({
        title: __("Discretion being the better part of valour, you leave the casino."),
        color: COLORS.WARNING,
      }),
      doLook: true
    });
  }
}

module.exports = ComplainEncounter;