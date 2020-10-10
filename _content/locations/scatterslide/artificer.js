"use strict";

let Location = require('@app/content/locations').Location;

const STATS = require('@constants').STATS;

/**
 * The artificer at the Scatterslide Mines.
 */
class Artificer extends Location {
  constructor() {
    super({
      type: 'scatterslide-artificer',
      buttonText: __("Artificer"),
      image: 'locations/scatterslide/rings.png',
      connectedLocations: [
        'scatterslide-merchants',
      ],
      shopEquipment: {
        'relics': {
          shopText: __('Buy Relics'),
          equipment: [
            'equipment-relics-009_iron_blasting_rod',
            'equipment-relics-012_steel_blasting_rod',
          ],
        },
      }
    });
  }

  /**
   * Get the display name of this location.
   *
   * @param {Character} character - The character to display the name to.
   *
   * @return {string}
   */
  getDisplayName(character) {
    return character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)
      ? __("Rebuilt Artificer")
      : __("Ransacked Artificer");
  }

  /**
   * Get the description for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    return character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)
      ? __("An aged man with a comically oversized monacle sits at a rickety table, tinkering with something.  He notices your entry and welcomes you warmly, proudly showing you his latest creations.")
      : __("An aged man with a broken monacle sits at a rickety stool, fidgeting with something.  He notices your entry and shrugs, dispiritedly motioning towards his meagre wares.");
  }

  /**
   * Get the equipment sold by this shop.
   * Can be overridden on a per-character basis.
   *
   * @param {Character} character - The Character doing the buying.
   *
   * @return {object}
   */
  getShopEquipment(character) {
    if (character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      return {
        'relics': {
          shopText: __('Buy Relics'),
          equipment: [
            'equipment-relics-009_iron_blasting_rod',
            'equipment-relics-012_steel_blasting_rod',
            'equipment-relics-016_silver_blasting_rod',
            'equipment-relics-018_jeweled_blasting_rod',
          ],
        },
        'accesories': {
          shopText: __('Buy Accessories'),
          equipment: [
            'equipment-accessories-015_chunky_iron_bracelet',
            'equipment-accessories-015_silver_saphire_earring',
            'equipment-accessories-015_garnet_heart_amulet',
            'equipment-accessories-015_glowing_pearl_ring',
          ],
        },
      };
    }
    else {
      return this._shopEquipment;
    }
  }
}

module.exports = Artificer;