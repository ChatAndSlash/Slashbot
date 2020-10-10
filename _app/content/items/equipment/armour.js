"use strict";

const Equipment = require("@app/content/items/equipment").Equipment;

/**
 * Base armour class.
 */
class Armour extends Equipment {
  constructor(info) {
    super(info);

    this.equipType = 'armour';

    this.defence    = _.get(info, 'defence', 0);
    this.dodge      = _.get(info, 'dodge', 0);
    this.spellPower = _.get(info, 'spellPower', 0);
  }

  /**
   * Unequip this item from the specified character.
   *
   * @param {Character} character - The character to unequip the item from.
   */
  unequipFrom(character) {
    character._defence    -= this.defence;
    character._dodge      -= this.dodge;
    character._spellPower -= this.spellPower;

    character.armour = null;
  }

  /**
   * Equip this item to the specified character.
   *
   * @param {Character} character - The character to equip the item to.
   */
  equipTo(character) {
    character._defence    += this.defence;
    character._dodge      += this.dodge;
    character._spellPower += this.spellPower;

    character.armour = this;
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return string
   */
  getShopDescription(character) {
    return this.getEquipmentShopDescription(character.armour, ['defence', 'dodge','spellPower']);
  }
}

module.exports = Armour;
