"use strict";

const Location = require('@app/content/locations').Location;
const Text     = require('@util/text');

/**
 * The blacksmith in the city of Tyrose.
 */
class Blacksmith extends Location {
  constructor() {
    super({
      type: 'tyrose-shoppes-blacksmith',
      displayName: "Jack Blacksmith",
      buttonText: "Blacksmith",
      description: "Standing before the forge is a swarthy man, heating the forge to a terrifying degree with his bellows.  Noticing your presence, he ambles over.",
      image: 'locations/tyrose/weapon_shop.png',
      connectedLocations: [
        'tyrose-shoppes',
      ],
      shopEquipment: {
        'weapons': {
          shopText: 'Buy Weapons',
          equipment: [
            'equipment-weapons-001_pine_club',
            'equipment-weapons-002_ash_club',
            'equipment-weapons-004_oak_club',
            'equipment-weapons-006_ironwood_club',
          ],
        },
        'armour': {
          shopText: 'Buy Armour',
          equipment: [
            'equipment-armour-001_clothes',
            'equipment-armour-003_padded_cloth',
            'equipment-armour-005_patched_leather',
            'equipment-armour-007_clean_leather',
          ]
        }
      },
      shopItems: {
        'premium': {
          shopText: 'Premium Goods',
          style: 'primary',
          items: [
            'consumables-ambrosia',
            'blessed_key',
            'boost-max_ap'
          ],
        },
      }
    });
  }

  /**
   * Get any extra description for the shop type the user is looking at.
   *
   * @param {Character} character - The character doing the shopping.
   * @param {string} shopType - The type of shop the character is shopping at.
   *
   * @return {string}
   */
  getShopDescription(character, shopType) {
    let description = '';

    if ('premium' === shopType) {
      description = "\n\n*\"Ah yes, an eye for the finer things,\"* he says.  \"If you have any _Dragon Scales,_ I can sell you some of these highly exclusive items.  _Dragon Scales_, of course, can be purchased just over here:\"\n\n" + Text.getBuyUrl(character);
    }

    return description + super.getShopDescription(character, shopType);
  }
}

module.exports = Blacksmith;