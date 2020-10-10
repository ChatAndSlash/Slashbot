"use strict";

const Pet = require('@app/content/items/equipment/pets');

class NoPet extends Pet {
  constructor() {
    super({
      type: 'equipment-pets-000_no_pet',
      displayName: __('No Pet'),
      description: __('You do not have a pet.'),
    });
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return {string}
   */
  getShopDescription(character) {
    return __('');
  }
}

module.exports = NoPet;