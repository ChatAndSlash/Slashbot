"use strict";

let Location = require('@app/content/locations').Location;

const STATS = require('@constants').STATS;

/**
 * The blacksmith at the Scatterslide Mines.
 */
class Blacksmith extends Location {
  constructor() {
    super({
      type: 'scatterslide-blacksmith',
      buttonText: __("Blacksmith"),
      image: 'locations/scatterslide/weapon_shop.png',
      connectedLocations: [
        'scatterslide-merchants',
      ],
      shopEquipment: {
        'weapons': {
          shopText: __('Buy Weapons'),
          equipment: [
            'equipment-weapons-008_iron_war_hammer',
            'equipment-weapons-011_reinforced_mining_pick',
          ],
        },
        'armour': {
          shopText: __('Buy Armour'),
          equipment: [
            'equipment-armour-010_loose_ringmail',
            'equipment-armour-013_padded_ringmail',
          ]
        }
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
    return character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)
      ? __("Rebuilt Blacksmith")
      : __("Smashed Blacksmith");
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
    return character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)
      ? __("A stout and stern-looking woman is happily working the bellows for the forge.  She gestures at the large collection of arms and armour on the wall.  \"Much better selection for ya now,\" she says.  \"I think you'll find the prices reasonable, too.\"")
      : __("The blacksmith has been ransacked and is in a state of massive disrepair.  The walls are crumbling and the forge itself is unusable.  A stern looking woman sitting near the forge gestures at the meagre selection left over.  \"Not much left, but if you can find something useful, I'll still sell it to you.\"");
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
    if (character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)) {
      return {
        'weapons': {
          shopText: __('Buy Weapons'),
          equipment: [
            'equipment-weapons-008_iron_war_hammer',
            'equipment-weapons-011_reinforced_mining_pick',
            'equipment-weapons-015_spiked_morningstar',
            'equipment-weapons-019_blackiron_mace',
          ],
        },
        'armour': {
          shopText: __('Buy Armour'),
          equipment: [
            'equipment-armour-010_loose_ringmail',
            'equipment-armour-013_padded_ringmail',
            'equipment-armour-017_shardscale',
            'equipment-armour-019_fullscale',
          ]
        }
      };
    }
    else {
      return this._shopEquipment;
    }
  }
}

module.exports = Blacksmith;