"use strict";

const Spell = require('@app/content/spells').Spell;

const getFortune = require('@app/fortune');

const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;

class ScrySpell extends Spell {
  constructor() {
    super({
      type: 'scry',
      displayName: __('Scry'),
      mpCost: 5,
      description: __("Peer into the future and learn a bit about how to proceed."),
      school: SPELL_SCHOOLS.DIVINITY,
      gold: 25,
    });
  }

  /**
   * Get a hint as to what to do next.
   *
   * @param {Character} character - The character casting the spell.
   *
   * @return {string} Message generated by casting this spell.
   */
  castIdle(character) {
    const mpCost = this.getMpCost(character);
    character.mp -= mpCost;

    return __("You concentrate on the future, and you hear a voice speak in your mind.  (-%d MP)  It says:\n%s", mpCost, getFortune(character));
  }
}

module.exports = ScrySpell;