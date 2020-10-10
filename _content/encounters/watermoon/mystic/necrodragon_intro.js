"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;
const Enemies     = require('@app/content/enemies').Enemies;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME = 'watermoon-mystic-necrodragon_intro';
const ACTION_DEFEND  = 'defend';

/**
 * Necrodragon introduction encounter.
 */
class NecrodragonIntroEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __('As you explore the corridors, you hear the ragged breathing of the Necrodragon grow louder as you draw closer, until suddenly it ceases entirely.  You freeze, trying to listen for even the tiniest noise, but are completely taken by surprise when two bright green flames light up in front of you.  The Necrodragon\'s face is mere feet from your own, and you and she hold each other\'s gaze for what seems like an eternity.  Finally, she speaks.\n\n"Ssso you think you can challenge me, in my own home?  You arrogant, insssolent worm!"  With that, she attacks!'),
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
    const bonus = Math.ceil(level * 0.4);
    enemy.setLevel(level, bonus);

    character.state = CHARACTER_STATE.FIGHTING;

    await this.updateLast({
      attachments: Attachments.one({ title: __(":white_check_mark: Got it!") }),
      doLook: true
    });
  }
}

module.exports = NecrodragonIntroEncounter;