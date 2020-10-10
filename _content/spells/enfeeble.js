"use strict";

const Spell  = require('@app/content/spells').Spell;

const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;
const FLAGS         = require('@constants').FLAGS;

const TURNS_FEEBLE = 3;
const FEEBLE_MIN = 25;
const FEEBLE_MAX = 50;

class EnfeebleSpell extends Spell {
  constructor() {
    super({
      type: 'enfeeble',
      displayName: __('Enfeeble'),
      description: __("Sap the living energy directly from your opponent, lowering both their attack and defence by 25%% for %d turns.", TURNS_FEEBLE),
      school: SPELL_SCHOOLS.ENCHANTMENT,
      mpCost: 25,
      gold: 400,
      canCastFighting: true,
    });
  }

  /**
   * Get the description for this spell.
   *
   * @param {Character} character - The character getting the description.
   *
   * @return {array}
   */
  getDescription(character) {
    return __("Sap the living energy directly from your opponent, lowering both their attack and defence by %d%% for %d turns.", this.getEnfeebleAmount(character), TURNS_FEEBLE);
  }

  /**
   * Enfeeble that enemy!
   *
   * @param {Character} character - The character casting the spell.
   *
   * @return {array}
   */
  castFighting(character) {
    const enfeebledBy = this.getEnfeebleAmount(character);
    character.mp -= this.getMpCost(character);
    character.enemy.setFlag(FLAGS.FEEBLE_TURNS, TURNS_FEEBLE + 1);

    return [__(":cold_sweat: You sap the energy from %s, bringing them briefly to their knees and lowering both their attack and defence by %d%% for %d turns.", character.enemy.getDisplayName(character), enfeebledBy, TURNS_FEEBLE)];
  }

  /**
   * Get the amount the character enfeebles their enemy's defence by.
   *
   * @param {Character} character - The character doing the enfeebling.
   *
   * @return {integer}
   */
  getEnfeebleAmount(character) {
    return Math.min(FEEBLE_MAX, FEEBLE_MIN + Math.ceil(character.spellPower / 5));
  }
}

module.exports = EnfeebleSpell;