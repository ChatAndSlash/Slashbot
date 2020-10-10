"use strict";

const Equipment = require('@app/content/items/equipment').Equipment;
const Fields    = require('slacksimple').Fields;

/**
 * Base pet class.
 */
class Pet extends Equipment {
  constructor(info) {
    super(info);

    this.shopText = _.get(info, 'shopText', '');

    this.providesLight = _.get(info, 'providesLight', false);

    this.equipType = 'pet';
  }

  static get NO_PET() {
    return 'equipment-pets-000_no_pet';
  }

  /**
   * Get the fields to display when this item is examined.
   *
   * @param {Character} character - The character examining this item.
   *
   * @return {array}
   */
  getExamineFields(character) {
    let fields = new Fields();
    fields.add("Combat effect", this.shopText, true);
    return fields;
  }

  /**
   * Unequip this item from the specified character.
   *
   * @param {Character} character - The character to unequip the item from.
   */
  unequipFrom(character) {
    character.pet = null;
  }

  /**
   * Equip this item to the specified character.
   *
   * @param {Character} character - The character to equip the item to.
   */
  equipTo(character) {
    character.pet = this;
  }

  /**
   * Perform your pet's action in combat.
   *
   * @param {Character} character - The owner of the pet.
   *
   * @return {array} Messages generated.
   */
  doPetAction(character) {}

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return {string}
   */
  getShopDescription(character) {
    return character.pet.type === this.type ? "--Equipped--" : this.shopText;
  }
}

module.exports = Pet;