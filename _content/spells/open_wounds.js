"use strict";

const Spell = require('@app/content/spells').Spell;

const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const MIN_DAMAGE = 30;
const MAX_DAMAGE = 60;
const MP_COST = 15;

class OpenWoundsSpell extends Spell {
  constructor() {
    super({
      type: 'open_wounds',
      displayName: __('Open Wounds'),
      description: __("Open terrible wounds on your opponent, but at the expense of opening lesser ones on yourself."),
      school: SPELL_SCHOOLS.NECROMANCY,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      canCastFighting: true,
      doesDamage: true,
    });
  }

  /**
   * Open terrible wounds on your enemy and lesser ones on yourself.
   *
   * @param {Character} character - The character casting the spell.
   *
   * @return {array}
   */
  castFighting(character) {
    character.mp -= this.getMpCost(character);

    const damage = this.getSpellDamage(character);
    character.enemy.decreaseHp(damage);

    const selfDamage = Math.ceil(damage / 3);
    character.decreaseHp(selfDamage);

    return [__(":white_frowning_face: You draw forth necromantic energies and cause wounds to open up on your enemy, dealing %d damage.  Smaller wounds open up on you as well, dealing %d damage.", damage, selfDamage)];
  }
}

module.exports = OpenWoundsSpell;