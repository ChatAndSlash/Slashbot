"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;
const STATS           = require('@constants').STATS;

const ENCOUNTER_NAME  = 'watermoon-modify_dragons';

const ACTION_KILL   = 'kill';
const ACTION_UNKILL = 'unkill';
const ACTION_DONE   = 'done';

/**
 * Golden Drake encounter.
 */
class ModifyDragonStateEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("Here's a weird piece of testing magic: You can kill/unkill all the Watermoon dragons here (except Aureth).  Why would you want to do that?  Well, every dragon killed unlocks the level cap by 10 and unlocks more equipment in the shops.  This is a testing-only option, of course."),
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
    return 'locations/city.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Modify Dragon State");
  }

  /**
   * Get the actions for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    if (character.hasKilledEnemy('watermoon-mystic-necrodragon')) {
      actions.addButton(__("Unkill Necrodragon"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_UNKILL, dragon: 'watermoon-mystic-necrodragon' } } );
    }
    else {
      actions.addButton(__("Kill Necrodragon"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_KILL, dragon: 'watermoon-mystic-necrodragon' } } );
    }

    if (character.hasKilledEnemy('watermoon-scholar-black_dragon')) {
      actions.addButton(__("Unkill Black Dragon"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_UNKILL, dragon: 'watermoon-scholar-black_dragon' } } );
    }
    else {
      actions.addButton(__("Kill Black Dragon"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_KILL, dragon: 'watermoon-scholar-black_dragon' } } );
    }

    if (character.hasKilledEnemy('watermoon-rumble-red_dragon')) {
      actions.addButton(__("Unkill Red Dragon"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_UNKILL, dragon: 'watermoon-rumble-red_dragon' } } );
    }
    else {
      actions.addButton(__("Kill Red Dragon"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_KILL, dragon: 'watermoon-rumble-red_dragon' } } );
    }

    actions.addButton(__("Done"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_DONE } } );

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
    let title;

    if (ACTION_KILL === action) {
      character.setStat(STATS.ENEMIES_KILLED, 1, this.info.dragon);
      title = ":white_check_mark: Dragon killed.";
    }
    else if (ACTION_UNKILL == action) {
      character.setStat(STATS.ENEMIES_KILLED, 0, this.info.dragon);
      title = ":white_check_mark: Dragon unkilled.";
    }
    else if (ACTION_DONE === action) {
      title = ":white_check_mark: Got it!";
    }

    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title, color: COLORS.GOOD }),
      doLook: true
    });
  }
}

module.exports = ModifyDragonStateEncounter;