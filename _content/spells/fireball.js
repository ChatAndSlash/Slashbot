"use strict";

const Spell  = require('@app/content/spells').Spell;

const FLAGS         = require('@constants').FLAGS;
const PROPERTIES    = require('@constants').PROPERTIES;
const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const BURNED_TURNS = 6;
const MIN_DAMAGE = 45;
const MAX_DAMAGE = 75;
const MP_COST = 20;

class FireballSpell extends Spell {
  constructor() {
    super({
      type: 'fireball',
      displayName: __('Fireball'),
      description: __("Ignite an enemy in combat (%d-%d damage).", MIN_DAMAGE, MAX_DAMAGE),
      school: SPELL_SCHOOLS.CONJURATION,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      gold: 500,
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

    messages.push(__(":fire: You form a ball of fire between your hands and hurl it at %s, dealing *%d* damage.", enemy.getDisplayName(character), damage));

    // Took extra damage from the burn attack
    if (enemy.hasFlag(FLAGS.BURNED_TURNS)) {
      messages.push(__(":fire: %s is burned and takes extra damage from your burn attack!", enemy.getDisplayName(this)));
    }

    messages = messages.concat(enemy.addStatusBurned(BURNED_TURNS));

    return messages;
  }
}

module.exports = FireballSpell;