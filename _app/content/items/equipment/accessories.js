"use strict";

const Equipment = require("@app/content/items/equipment").Equipment;

/**
 * Base accessory class.  Can alter any stat!
 */
class Accessory extends Equipment {
  constructor(info) {
    super(info);

    this.equipType = 'accessory';

    this.force     = _.get(info, 'force', 0);
    this.technique = _.get(info, 'technique', 0);
    this.defence   = _.get(info, 'defence', 0);

    this.dodge = _.get(info, 'dodge', 0);
    this.crit  = _.get(info, 'crit', 0);

    this.spellPower  = _.get(info, 'spellPower', 0);

    this.maxHp = _.get(info, 'maxHp', 0);
    this.maxMp = _.get(info, 'maxMp', 0);
    this.maxAmmo = _.get(info, 'maxAmmo', 0);

    this.providesLight = _.get(info, 'providesLight', false);
  }

  /**
   * Unequip this item from the specified character.
   *
   * @param {Character} character - The character to unequip the item from.
   */
  unequipFrom(character) {
    character._force     -= this.force;
    character._technique -= this.technique;
    character._defence   -= this.defence;

    character._maxHp -= this.maxHp;
    character.hp = Math.min(character.maxHp, character.hp);

    character.maxMp -= this.maxMp;
    character.mp = Math.min(character.maxMp, character.mp);

    character._dodge -= this.dodge;
    character._crit  -= this.crit;

    character._spellPower -= this.spellPower;

    character.accessory = null;
  }

  /**
   * Equip this item to the specified character.
   *
   * @param {Character} character - The character to equip the item to.
   */
  equipTo(character) {
    character._force     += this.force;
    character._technique += this.technique;
    character._defence   += this.defence;

    character._maxHp += this.maxHp;
    character.maxMp += this.maxMp;

    character._crit  += this.crit;
    character._dodge += this.dodge;

    character._spellPower += this.spellPower;

    character.accessory = this;
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return string
   */
  getShopDescription(character) {
    return this.getEquipmentShopDescription(character.accessory, ['force', 'technique', 'defence', 'crit', 'dodge', 'maxHp', 'maxMp', 'maxSp', 'maxAmmo', 'spellPower']);
  }
}

module.exports = Accessory;
