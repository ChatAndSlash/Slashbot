"use strict";

const Equipment = require("@app/content/items/equipment").Equipment;

/**
 * Base relic class.
 */
class Relic extends Equipment {
  constructor(info) {
    super(info);

    this.equipType = 'relic';

    this.spellPower  = _.get(info, 'spellPower', 0);
  }

  /**
   * Unequip this item from the specified character.
   *
   * @param {Character} character - The character to unequip the item from.
   */
  unequipFrom(character) {
    character._spellPower -= this.spellPower;

    character.relic = null;
  }

  /**
   * Equip this item to the specified character.
   *
   * @param {Character} character - The character to equip the item to.
   */
  equipTo(character) {
    character._spellPower += this.spellPower;

    character.relic = this;
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return {string}
   */
  getShopDescription(character) {
    const oldRelic = character.relic;

    if (oldRelic.type === this.type) {
      return "--Equipped--";
    }

    const diff = this.spellPower - oldRelic.spellPower;
    const sign = diff >= 0 ? '+' : '';

    return `${this.spellPower} Spell Power (${sign}${diff})`;
  }
}

module.exports = Relic;
