"use strict";

const Spell = require('@app/content/spells').Spell;

const PROPERTIES    = require('@constants').PROPERTIES;
const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const CHILLED_TURNS = 10;

const MIN_DAMAGE = 30;
const MAX_DAMAGE = 50;
const MP_COST = 10;

class FrostBlastSpell extends Spell {
  constructor() {
    super({
      type: 'frost_blast',
      displayName: "Frost Blast",
      description: `Chill an enemy with a blast of icy frost (${MIN_DAMAGE}-${MAX_DAMAGE} damage).`,
      school: SPELL_SCHOOLS.CONJURATION,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      gold: 350,
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

    messages.push(`:snowflake: You blast ${enemy.getDisplayName(character)} with icy frost, dealing *${damage}* damage.`);
    messages = messages.concat(enemy.addStatusChilled(CHILLED_TURNS));

    return messages;
  }
}

module.exports = FrostBlastSpell;