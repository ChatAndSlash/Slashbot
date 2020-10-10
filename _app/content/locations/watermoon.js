"use strict";

const Location = require('@app/content/locations').Location;
const Loot     = require('@app/loot').Loot;
const LootSlot = require('@app/loot').LootSlot;
const Actions  = require('slacksimple').Actions;
const ordinal  = require('ordinal');

const FLAGS = require('@constants').FLAGS;

/**
 * Watermoon locations parent class.
 */
class WatermoonLocation extends Location {
  /**
   * Set the enemy level based on the character's level, with a maximum of 26, 36, or 46,
   * based on the number of Watermoon dragons killed.
   *
   * @param {Enemy} enemy - The enemy to get the level for.
   * @param {Character} character - The character in this location.
   *
   * @return {integer}
   */
  getEnemyLevel(enemy, character) {
    if (enemy.isBoss) {
      return character.level;
    }

    let watermoonOffset = 20;

    if (2 === this.getLivingDragons(character)) {
      watermoonOffset = 30;
    }
    else if ([1, 0].includes(this.getLivingDragons(character))) {
      watermoonOffset = 40;
    }

    return Math.min(character.level, Math.min(watermoonOffset + 6, 50));
  }

  /**
   * Boost up enemies with a bonus to make them the equivalent of the character's level, even
   * when they have to be limited to X6 for XP purposes.
   *
   * i.e.  If character is 38, enemy has to be limited to 36.  Give them a +2 level bonus.
   *
   * @param {Enemy} enemy - The enemy to get the level bonus for.
   * @param {Character} character - The character in this location.
   * @param {string} type - The type of the enemy to check.
   *
   * @return {integer}
   */
  getEnemyLevelBonus(enemy, character, type) {
    const enemyLevel = character.location.getEnemyLevel(this, character);

    return Math.max(0, character.level - enemyLevel);
  }

  /**
   * Get the loot contained in a Cursed Chest in this location.
   *
   * @param {Character} character - The character looting the Cursed Chest.
   *
   * @return {Loot}
   */
  getCursedChestLoot(character) {
    return new Loot(
      new LootSlot().addEntry(100, 'catalyst-moondrop', 7, 10),
      new LootSlot().addEntry(50, 'consumables-potion', 3, 7).addEntry(50, 'consumables-elixir', 3, 7),
      new LootSlot().addEntry(50, 'consumables-antidote', 2, 5).addEntry(50, 'consumables-smelling_salts', 2, 5),
      new LootSlot().addEntry(100, 'torch', 10, 20),
    );
  }

  /**
   * Get the number of killable dragons in Watermoon still alive.
   *
   * @param {Character} character - The character to check the dragon count for.
   *
   * @return {integer}
   */
  getLivingDragons(character) {
    let count = 3;

    if (character.hasKilledEnemy('watermoon-mystic-necrodragon')) {
      count--;
    }
    if (character.hasKilledEnemy('watermoon-scholar-black_dragon')) {
      count--;
    }
    if (character.hasKilledEnemy('watermoon-rumble-red_dragon')) {
      count--;
    }

    return count;
  }

  /**
   * Gets a button to leave the Labyrinth.
   * Green if you can return directly to this crossroads, pops up a warning if you cannot.
   *
   * @param {Character} character - The character who might want to leave the Labyrinth.
   *
   * @return {object}
   */
  getLeaveLabyrinthButton(character) {
    const completed = character.getFlag(FLAGS.HALLWAYS_COMPLETED);
    const remaining = character.getFlag(FLAGS.HALLWAY_REMAINING);
    const completedText = completed === 0 ? "first" : ordinal(completed + 1);
    const checkpoint = Math.floor(completed / 5) * 5;
    const lastCheckpointText = checkpoint === 0 ? "first" : ordinal(checkpoint);
    const safeToLeave = completed > 0 && completed % 5 === 0 && remaining === 0;
    const style = safeToLeave ? 'primary' : false;
    const confirm = safeToLeave ? false  : {
      title: "Are you sure?  This labyrinth is confusing.",
      text: `If you leave now, you won't be able to get back here, to the ${completedText} hallway.  You'll only be able to find your way back to your last checkpoint, the ${lastCheckpointText} crossroads.`,
      ok_text: "Leave",
      dismiss_text: "Stay"
    };

    return Actions.getButton("Leave", "labyrinth_leave", {
      style,
      confirm,
    });
  }

  /**
   * If the character has killed all the Watermoon Dragons.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  areAllDragonsDead(character) {
    return character.hasKilledRedDragon() && character.hasKilledBlackDragon() && character.hasKilledNecrodragon();
  }

  /**
   * If the character has the Lystone.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  hasLystone(character) {
    return character.inventory.has('quest-watermoon-lystone');
  }

  /**
   * Get the number of Lystone Chips the character has.
   *
   * @param {Character} character - The character to check.
   *
   * @return {integer}
   */
  getLystoneChipCount(character) {
    return character.getFlag(FLAGS.LYSTONE_CHIP_COUNT, 0);
  }
}

module.exports = {
  WatermoonLocation
};