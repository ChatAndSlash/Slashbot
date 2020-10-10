"use strict";

const Spell  = require('@app/content/spells').Spell;

const FLAGS         = require('@constants').FLAGS;
const PROPERTIES    = require('@constants').PROPERTIES;
const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const BURNED_TURNS = 6;
const MIN_DAMAGE = 90;
const MAX_DAMAGE = 150;
const MP_COST = 30;

class FlameJetSpell extends Spell {
  constructor() {
    super({
      type: 'flame_jet',
      displayName: __('Flame Jet'),
      description: __("Engulf an enemy in flames (%d-%d damage).", MIN_DAMAGE, MAX_DAMAGE),
      school: SPELL_SCHOOLS.CONJURATION,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      gold: 3500,
      canCastFighting: true,
      doesDamage: true,
      properties: [
        PROPERTIES.BURN_ATTACK,
      ]
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
    let messages = [];

    character.mp -= this.getMpCost(character);

    const damage = this.getSpellDamage(character);
    enemy.decreaseHp(damage);

    messages.push(__(":fire: You will a jet of flame from your fingers, and it engulfs %s, dealing *%d* damage.", enemy.getDisplayName(character), damage));

    // Took extra damage from the burn attack
    if (enemy.hasFlag(FLAGS.BURNED_TURNS)) {
      messages.push(__(":fire: %s is burned and takes extra damage from your burn attack!", enemy.getDisplayName(this)));
    }

    messages = messages.concat(enemy.addStatusBurned(BURNED_TURNS));

    return messages;
  }
}

module.exports = FlameJetSpell;