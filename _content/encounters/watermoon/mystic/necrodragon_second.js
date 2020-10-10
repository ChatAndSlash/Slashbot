"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;
const Enemies     = require('@app/content/enemies').Enemies;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

const ENCOUNTER_NAME = 'watermoon-mystic-necrodragon_second';
const ACTION_DEFEND  = 'defend';

/**
 * Necrodragon second encounter.
 */
class NecrodragonSecondEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __('Warily, you head back down the Catacombs corridors, again seeking out the Necrodragon.  You turn a corner to find her sitting there, waiting for you.\n\n"Clearly you are no mere mortal.  Who sssent you?  Wasss it one of my mothersss?  Or that damnable golden worm who fraternizesss in town?  No matter.  I\'ll pay them each a visssit once I\'ve dessstroyed you!'),
      actions: Actions.oneButton(__("Defend yourself!"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_DEFEND } } )
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
    return 'encounters/watermoon/necrodragon.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Necrodragon");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let enemy = Enemies.new('watermoon-mystic-necrodragon');
    character.enemy = enemy;

    const level = character.location.getEnemyLevel(enemy, character);
    const bonus = Math.ceil(level * 0.5);
    enemy.setLevel(level, bonus);
    enemy.hp = character.getFlag(FLAGS.NECRODRAGON_HEALTH);

    character.state = CHARACTER_STATE.FIGHTING;

    await this.updateLast({
      attachments: Attachments.one({ title: __(":white_check_mark: Got it!") }),
      doLook: true
    });
  }
}

module.exports = NecrodragonSecondEncounter;