"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Enemies     = require('@app/content/enemies').Enemies;
const Random      = require('@util/random');
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STATS         = require('@constants').STATS;

const ENCOUNTER_NAME    = 'lost_purse';
const ACTION_PICK_IT_UP = 'pick_it_up';
const ACTION_LEAVE_IT   = 'leave_it';

/**
 * A lost purse, sitting casually on the ground.
 */
class LostPurseEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Pick it up"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_PICK_IT_UP } } );
    actions.addButton(__("Leave it"),   "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE_IT } } );

    super({
      type: ENCOUNTER_NAME,
      description: __("As you wander along, your eye alights on a bag on the ground.  You're not sure, but you think you saw something glitter inside."),
      actions,
    });
  }

  /**
   * Image of the lost purse.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/tyrose/bag.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Lost Purse");
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

    if (ACTION_PICK_IT_UP === action) {
      title = this.pickItUp(character);
      character.increaseStat(STATS.LOST_PURSE, 1, ACTION_PICK_IT_UP);
    }
    else if (ACTION_LEAVE_IT === action) {
      title = this.leaveIt(character);
      character.increaseStat(STATS.LOST_PURSE, 1, ACTION_LEAVE_IT);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Pick up the bag!
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  pickItUp(character) {
    let chance = Random.between(1, 100);
    let title  = '';

    // Clear the encounter state
    character.state = CHARACTER_STATE.IDLE;

    // 60% chance of it being gold
    if (chance >= 40) {
      // Add some gold
      let gold = Random.between(character.level, character.level * 5);
      character.gold += gold;

      title = __(":moneybag: You find %s gold inside!", gold);

      // 30% chance of it being crystal acid
    }
    else if (chance >= 10) {
      let amount = Random.between(1, 3);
      character.inventory.add('catalyst-crystal_acid', amount);

      title = __(":dragon: Oh, wow!  You find %s Crystal Acid inside!", amount);

      // 10% chance of it being an enemy trap
    }
    else {
      // Encounter a thug appropriate to the character's level
      let enemy = Enemies.new('thug');
      let level = character.location.getEnemyLevel(enemy, character);
      enemy.setLevel(level);
      character.enemy = enemy;
      character.state = CHARACTER_STATE.FIGHTING;

      title = __(":warning:  It was a trap!  The moment you reached for the bag a level %s %s jumped out and attacked you!", level, enemy.getDisplayName(character));
    }

    return title;
  }

  /**
   * Leave it behind...
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  leaveIt(character) {
    let chance = Random.between(1, 100);
    let title  = '';

    // Clear the encounter state
    character.state = CHARACTER_STATE.IDLE;

    // 80% chance of wondering what it was
    if (chance >= 20) {
      title = __(":white_check_mark:  Resisting temptation, you pass on by.  Sometimes discretion is the better part of valour, but you'll always wonder just what was inside...");

      // 20% chance of good samaritan
    }
    else {
      let gold = Random.between(character.level * 5, character.level * 10);
      character.hp = character.maxHp;
      character.inventory.add('consumables-potion', 5);
      character.gold += gold;

      title = __('You pass it by, deciding not to pick up what someone else may desperately miss.  As you pass a corner, a woman comes up to you and shakes your hand.  "Such a good samaritan!" she exclaims.  Before you can stop her, she heals your wounds and fills your pack with 5 potions and %d gold.', gold);
    }

    return title;
  }
}

module.exports = LostPurseEncounter;