"use strict";

const Location = require('@app/content/locations').Location;

/**
 * The ring shop in the city of Tyrose.
 */
class Rings extends Location {
  constructor() {
    super({
      type: 'tyrose-shoppes-rings',
      displayName: __("Ring Store"),
      description: __('Under protective glass, dozens of wonderful rings glitter brightly.'),
      image: 'locations/tyrose/rings.png',
      connectedLocations: [
        'tyrose-shoppes',
      ],
      shopEquipment: {
        'rings': {
          shopText: __('Buy Rings'),
          equipment: [
            'equipment-accessories-001_starter_ring',
            'equipment-accessories-005_garnet_loop',
            'equipment-accessories-005_malachite_band',
          ],
        },
      },
    });
  }

  /**
   * Display a buy action button for this location.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return array
   */
  addBuyActions(character, actions) {
    if (character.accessory.type === 'equipment-accessories-000_no_accessory') {
      actions.addButton(__("Buy Rings"), 'start_encounter', { params: { type: 'tyrose-ringmaker' } });
      return actions;
    }

    return super.addBuyActions(character, actions);
  }
}

module.exports = Rings;