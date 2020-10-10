"use strict";

const Spell  = require('@app/content/spells').Spell;
const Random = require('@util/random');

const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;
const FLAGS         = require('@constants').FLAGS;

const CHANCE_ENRAGE = 50;
const CHANCE_BOSS_ENRAGE = 10;
const TURNS_ENRAGED = 3;

class EnrageSpell extends Spell {
  constructor() {
    super({
      type: 'enrage',
      displayName: __('Enrage'),
      description: __("%d%% chance to cause your opponent to lose their cool and attack for the next %d turns, ignoring their other skills. (%d%% chance against bosses.)", CHANCE_ENRAGE, TURNS_ENRAGED, CHANCE_BOSS_ENRAGE),
      school: SPELL_SCHOOLS.ENCHANTMENT,
      mpCost: 20,
      gold: 2000,
      canCastFighting: true,
    });
  }

  /**
   * Enfeeble that enemy!
   *
   * @param {Character} character - The character casting the spell.
   *
   * @return {array}
   */
  castFighting(character) {
    character.mp -= this.getMpCost(character);

    if (this.doesEnrage(character.enemy)) {
      character.enemy.setFlag(FLAGS.ENRAGED_TURNS, TURNS_ENRAGED + 1);
      return [__("Red streaks fly from your hands at %s.  They lose their cool and fly into a rage!", character.enemy.getDisplayName(character))];
    }

    return [__("Red streaks fly from your hands at %s.  They shake their heads confusion for a moment, then re-engage you.", character.enemy.getDisplayName(character))];
  }

  /**
   * If the spell enrages the enemy or not.
   *
   * @param {Enemy} enemy - The enemy being cast at.
   *
   * @return {boolean}
   */
  doesEnrage(enemy) {
    const chance = enemy.isBoss ? CHANCE_BOSS_ENRAGE : CHANCE_ENRAGE;
    return Random.between(1, 100) <= chance;
  }
}

module.exports = EnrageSpell;