"use strict";

const Spell  = require('@app/content/spells').Spell;
const Random = require('@util/random');
const Text   = require('@util/text');

const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const MIN_STRIKES = 1;
const MAX_STRIKES = 5;

const MIN_DAMAGE = 40;
const MAX_DAMAGE = 60;
const MP_COST = 30;

class LightningStrikeSpell extends Spell {
  constructor() {
    super({
      type: 'lightning_strike',
      displayName: __('Lightning Strike'),
      description: __("Strike an enemy with lightning between %d and %d times (%d-%d damage).", MIN_STRIKES, MAX_STRIKES, MIN_DAMAGE, MAX_DAMAGE),
      school: SPELL_SCHOOLS.CONJURATION,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      gold: 5000,
      canCastFighting: true,
      doesDamage: true,
    });
  }

  /**
   * Let's do some damage!
   *
   * @param {Character} character - The character casting the spell.
   *
   * @return {array}
   */
  castFighting(character) {
    const enemy = character.enemy;

    character.mp -= this.getMpCost(character);

    let damage = 0;

    const strikes = this.getStrikesCount();
    for (let x = 0; x < strikes; x++) {
      damage += this.getSpellDamage(character);
    }

    enemy.decreaseHp(damage);

    const strikesText = __("%d %s", strikes, Text.pluralize("strike", strikes));

    return [__(":zap: You call down %s of lightning, dealing *%d* damage to %s.", strikesText, damage, enemy.getDisplayName(character))];
  }

  /**
   * Get the number of strikes this cast of the spell will do.
   *
   * @return {integer}
   */
  getStrikesCount() {
    return Random.getWeighted([
      { 'weight': 10, value: 1 },
      { 'weight': 20, value: 2 },
      { 'weight': 40, value: 3 },
      { 'weight': 20, value: 4 },
      { 'weight': 10, value: 5 },
    ]);
  }
}

module.exports = LightningStrikeSpell;