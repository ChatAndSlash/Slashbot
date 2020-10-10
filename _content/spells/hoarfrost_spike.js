"use strict";

const Spell = require('@app/content/spells').Spell;

const PROPERTIES    = require('@constants').PROPERTIES;
const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const CHILLED_TURNS = 10;

const MIN_DAMAGE = 70;
const MAX_DAMAGE = 110;
const MP_COST = 15;

class HoarfrostSpikeSpell extends Spell {
  constructor() {
    super({
      type: 'hoarfrost_spike',
      displayName: "Hoarfrost Spike",
      description: `Hurl a spike of icy hoarfrost at your enemy (${MIN_DAMAGE}-${MAX_DAMAGE} damage).`,
      school: SPELL_SCHOOLS.CONJURATION,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      gold: 2500,
      canCastFighting: true,
      doesDamage: true,
      properties: [
        PROPERTIES.CHILL_ATTACK,
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
    let messages = [];
    const enemy = character.enemy;

    character.mp -= this.getMpCost(character);

    const damage = this.getSpellDamage(character);
    enemy.decreaseHp(damage);

    messages.push(`:snowflake: You hurl a spike of hoarfrost at ${enemy.getDisplayName(character)}, dealing *${damage}* damage.`);
    messages = messages.concat(enemy.addStatusChilled(CHILLED_TURNS));

    return messages;
  }
}

module.exports = HoarfrostSpikeSpell;