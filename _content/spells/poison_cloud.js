"use strict";

const Spell = require('@app/content/spells').Spell;

const FLAGS         = require('@constants').FLAGS;
const PROPERTIES    = require('@constants').PROPERTIES;
const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const TURNS_POISON_CLOUD = require('@constants').TURNS_POISON_CLOUD;

const MIN_DAMAGE = 60;
const MAX_DAMAGE = 100;
const MP_COST = 20;

class PoisonCloudSpell extends Spell {
  constructor() {
    super({
      type: 'poison_cloud',
      displayName: __('Poison Cloud'),
      description: __("Summon a poisonous cloud that will grow in size and damage over the next %d turns.", TURNS_POISON_CLOUD),
      school: SPELL_SCHOOLS.CONJURATION,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      canCastFighting: true,
      doesDamage: true,
      properties: [
        PROPERTIES.AOE_ATTACK,
      ]
    });
  }

  /**
   * Summon a stinking, poisonous cloud.
   *
   * @param {Character} character - The character casting the spell.
   *
   * @return {array}
   */
  castFighting(character) {
    const enemy = character.enemy;

    character.mp -= this.getMpCost(character);
    enemy.setFlag(FLAGS.POISON_CLOUD_TURNS, TURNS_POISON_CLOUD);

    const spellDamage = this.getSpellDamage(character);
    enemy.setFlag(FLAGS.POISON_CLOUD_DAMAGE, spellDamage);

    return [__(":cloud: You summon a poisonous cloud that will grow in size and damage over the next %d turns.", TURNS_POISON_CLOUD)];
  }
}

module.exports = PoisonCloudSpell;