"use strict";

const Location = require('@app/content/locations').Location;
const Text     = require('@util/text');

/**
 * The provisioner at the Scatterslide Mines.
 */
class Provisioner extends Location {
  constructor() {
    super({
      type: 'scatterslide-provisioner',
      displayName: __("Provisioner"),
      buttonText: __("Provisioner"),
      description: __("A grizzled old man in a faded, floppy brown hat stands next to a couple of loaded pack horses.  \"Whatever you need to head on into them mines, I got,\" he says.  \"Found some scrolls a while back too, that I been told have magic spells on 'em.  Yours for the right price.  Not to mention, I know a little bit about Alchemy...\""),
      image: 'locations/scatterslide/provisioner.png',
      connectedLocations: [
        'scatterslide-merchants',
      ],
      flasks: [
        'maxHp',
        'maxMp',
      ],
      flaskText: __("Alchemy?"),
      itemCostMultiplier: 2,
      shopItems: {
        'provisions': {
          shopText: __('Buy Provisions'),
          items: [
            'consumables-potion',
            'consumables-elixir',
            'consumables-antidote',
            'consumables-smelling_salts',
            'consumables-cold_compress',
            'consumables-hot_chocolate',
            'consumables-blessing',
            'torch',
          ],
        },
        'premium': {
          shopText: __('Premium Goods'),
          style: 'primary',
          items: [
            'consumables-ambrosia',
            'blessed_key',
            'boost-max_ap'
          ],
        },
      },
      shopSpells: {
        'simple': {
          shopText: __('Learn Spells'),
          items: [
            'cure',
            'enfeeble',
            'fireball',
            'frost_blast',
          ]
        }
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
      description = __("\n\n*\"Right, this here is my more exclusive stock\"*, he says.  \"I don't let these babies go for just gold, only _Dragon Scales_ will do.  Don't have any?  Well, you can pick some up here:\"\n\n") + Text.getBuyUrl(character);
    }

    return description + super.getShopDescription(character, shopType);
  }
}

module.exports = Provisioner;