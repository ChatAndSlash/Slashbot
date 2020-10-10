"use strict";

const Actions  = require('slacksimple').Actions;
const Location = require('@app/content/locations').Location;

/**
 * A hut in the forest, with a hermit living in it.
 */
class HermitHut extends Location {
  constructor() {
    super({
      type: 'tyrose-forest-hermit_hut',
      displayName: __('Hermit\'s Hut'),
      description: __('Small and cramped inside, the hermit stumps and thumps around looking for things and largely not finding them.'),
      image: 'locations/tyrose/hermit_hut.png',
      connectedLocations: [
        'tyrose-forest',
      ],
    });
  }

  /**
   * If you haven't learned any spells, you can only talk with the hermit.
   *
   * @param {Character} character - The character getting actions.
   * @param {Actions} actions - The Actions to add to.
   *
   * @return {array}
   */
  getActions(character, actions = false) {
    actions = new Actions();

    if ( ! character.knowsSpell('cinders')) {
      actions.addButton(__("Talk with Hermit"), "start_encounter", { params: { type: 'forest-hermit_hut-hermit_wand' } });
    }

    return super.getActions(character, actions);
  }

  /**
   * Get the equipment this location sells.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {object}
   */
  getShopEquipment(character) {
    // If you've learned magic, you can buy relics
    if (character.knowsSpell('cinders')) {
      return {
        'relics': {
          shopText: __('Buy Relics'),
          equipment: [
            'equipment-relics-001_simple_wand',
            'equipment-relics-003_shell_wand',
            'equipment-relics-005_beaded_wand',
            'equipment-relics-007_racing_wand',
          ],
        }
      };
    }
    else {
      return {};
    }
  }

  /**
   * Get the spells this location sells.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {object}
   */
  getShopSpells(character) {
    // If you've learned magic, you can buy more spells
    if (character.knowsSpell('cinders')) {
      return {
        'simple': {
          shopText: __('Learn Spells'),
          items: [
            'scry',
            'icicle',
          ]
        }
      };
    }
    else {
      return {};
    }
  }
}

module.exports = HermitHut;