"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_TYPE = 'forest-hermit_hut-hermit_wand';

const ACTION_LEARN = 'learn';

/**
 * The hermit in the hut teaches you some magic!
 */
class HermitWandEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_TYPE,
      description: __('The hermit, after seeing your wand and letting you in, seems very eager now to talk to you. "Excellent, excellent!" he cries. "So very nice to finally have a dedicated student again!  I assume you\'d like to learn some magic, then?"'),
      actions: Actions.oneButton(__("Learn"), "encounter", { params: { type: ENCOUNTER_TYPE, action: ACTION_LEARN } })
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
    return 'encounters/tyrose/wizard_face.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Old Hermit");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_LEARN !== action) {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.learnSpell('cinders');
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({
        title: __("You sit down with the hermit as he teaches you how to properly swish and flick your wand. After a few hours of work, you can reliably cause flaming cinders to fly from your fingers, burning your enemies and providing light in dark places.  To cast it, click the \"Cast\" button in combat, or when out of combat, make sure you have 10 MP and type '/cast', then choose 'cinders'."),
      }),
      doLook: true,
    });
  }
}

module.exports = HermitWandEncounter;