"use strict";

const Spell  = require('@app/content/spells').Spell;

const FLAGS         = require('@constants').FLAGS;
const PROPERTIES    = require('@constants').PROPERTIES;
const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

const BURNED_TURNS = 6;
const MIN_DAMAGE = 15;
const MAX_DAMAGE = 25;
const MP_COST = 10;

class CindersSpell extends Spell {
  constructor() {
    super({
      type: 'cinders',
      displayName: __('Cinders'),
      description: __("Burn an enemy in combat (%d-%d damage), or light your way in dark spaces.", MIN_DAMAGE, MAX_DAMAGE),
      school: SPELL_SCHOOLS.CONJURATION,
      mpCost: MP_COST,
      minDamage: MIN_DAMAGE,
      maxDamage: MAX_DAMAGE,
      canCastFighting: true,
      doesDamage: true,
      properties: [
        PROPERTIES.BURN_ATTACK,
      ]
    });
  }

  /**
   * Provides light for the next encounter.
   *
   * @param {Character} character - The character casting the spell.
   *
   * @return {string} Message generated by casting this spell.
   */
  castIdle(character) {
    const cost = this.getMpCost(character);
    character.mp -= cost;

    character.setFlag(FLAGS.CINDERS_LIGHT_DURATION, 5);

    let castText = __('Sparks begin to fly from your fingers, warming you slightly and causing a glow to emanate from them.  You should have enough light to see by for 5 encounters.');
    if (character.location.type === 'tyrose-profession_alley-tavern') {
      castText += __('The bard jumps back, alarmed.  "Hey, be careful where you\'re casting that!  Sure, it\'ll help you see in the dark, but you could send this whole place up in flames!"');
    }
    castText += __('\n(-%d MP)', cost);

    return castText;
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

    messages.push(__(":fire: You conjure cinders from your fingers and fling them at %s, dealing *%d* damage.", enemy.getDisplayName(character), damage));

    // Took extra damage from the burn attack
    if (enemy.hasFlag(FLAGS.BURNED_TURNS)) {
      messages.push(__(":fire: %s is burned and takes extra damage from your burn attack!", enemy.getDisplayName(this)));
    }

    messages = messages.concat(enemy.addStatusBurned(BURNED_TURNS));

    return messages;
  }
}

module.exports = CindersSpell;