"use strict";

const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const Actions           = require('slacksimple').Actions;
const Text              = require('@util/text');

const { STATS, REPUTATION_LEVELS } = require('@constants');

/**
 * Exchange.  Trade alchemy items, meet Aureth.
 */
class Exchange extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-gilded-exchange',
      displayName: __('Exchange'),
      description: __("*Watermoon, Gilded District*\nThe exchange is dominated by Aureth, her massive golden bulk curled around itself in the center of the room.  She keeps a careful eye on all the trade going on around her, paying special attention to you.  Occasionally, she plucks a small furry animal from a pen nearby, spits a small, controlled amount of lightning on it, lightly cooking it from the inside, and swallows it whole."),
      image: 'locations/watermoon/bank.png',
      connectedLocations: [
        'watermoon-gilded-courtyard',
      ],
      shopItems: {
        'premium': {
          shopText: __('Premium Goods'),
          style: 'primary',
          items: [
            'consumables-ambrosia',
            'blessed_key',
            'boost-max_ap',
            'reputation-doublehead_coin'
          ],
        },
        'catalysts': {
          shopText: __('Alchemy Catalysts'),
          items: [
            'catalyst-moondrop',
            'catalyst-quicksalt',
            'catalyst-crystal_acid'
          ],
        },
        'reputation': {
          shopText: __('Reputation'),
          items: [],
          equipment: ['equipment-accessories-watermoon-050_goldscale_ring'],
        },
      },
      shopPetsButton: __("Exotic Pets"),
      shopPetsStyle: 'primary',
      shopPets: [
        'equipment-pets-charlie',
        'equipment-pets-billie',
        'equipment-pets-kiki',
      ],

    });
  }

  /**
   * If you have no mining pick, only option is to start encounter that is intro to this area.
   *
   * @param {Character} character - The character to get action buttons for.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    actions = super.getActions(character, actions);
    actions.addButton(__("Talk with Aureth"), "start_encounter", { params: { type: 'watermoon-gilded-aureth' } });

    return actions;
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
      description = __("\n\n*Aureth notices you approaching the Premium Goods stall and pokes her head over behind it.*  \"I know, I know, it seems morbid for me to collect Dragon Scales,\" she says.  \"But there is power in them, and I _gotta_ have my power.  So trade me for some of those scales!  Or, if you don't have any yet, you can pick some up here:\"\n\n") + Text.getBuyUrl(character);
    }
    else if ('pets' === shopType) {
      description = __("\n\n*A young woman sits just on the edge of the Exchange amongst a small stack of cages containing a variety of weasels.*  \"Hello, yes, come over!\" she says.  \"I sell only the finest wiggley little pets -- if you have the Dragon Scales to afford them, that is!  If you don't have any yet, you can pick some up here:\"\n\n") + Text.getBuyUrl(character);
    }
    else if ('reputation' === shopType) {
      const reputation = this.getReputation(character);
      if (reputation >= REPUTATION_LEVELS.ESTEEMED) {
        description = __("\n\n*You ask Aureth what reputation your exploits have garnered.*\n\n\"Hm, well currently you are _Esteemed_ by us,\" she says.  \"I can sell you tons of junk, including something really special!\"");
      }
      else if (reputation >= REPUTATION_LEVELS.RESPECTED) {
        description = __("\n\n*You ask Aureth what reputation your exploits have garnered.*\n\n\"Hm, well currently you are _Respected_ by us,\" she says.  \"I guess that means I can sell you some of these...\"");
      }
      else if (reputation >= REPUTATION_LEVELS.APPRECIATED) {
        description = __("\n\n*You ask Aureth what reputation your exploits have garnered.*\n\n\"Hm, well currently you are _Appreciated_ by us,\" she says.  \"I guess that means I can sell you some of these...\"");
      }
      else if (reputation >= REPUTATION_LEVELS.KNOWN) {
        description = __("\n\n*You ask Aureth what reputation your exploits have garnered.*\n\n\"Hm, well currently you are _Known_ by us,\" she says.  \"I guess that means I can sell you some of these...\"");
      }
      else {
        description = __("\n\n*You ask Aureth what reputation your exploits have garnered.*\n\n\"Hm, well currently you are _Unknown_ by us,\" she says.  \"So there's not really anything I can sell you just now.  Sorry, come back when you've done more stuff!\"");
      }
    }

    return description + super.getShopDescription(character, shopType);
  }

  /**
   * Get all the items this location sells.
   *
   * @param {Character} character - The character buying items.
   *
   * @return {object}
   */
  getShopItems(character) {
    const reputation = this.getReputation(character);
    let items = _.cloneDeep(super.getShopItems(character));

    if (reputation > REPUTATION_LEVELS.KNOWN) {
      items.reputation.items.push('boost-watermoon-force');
      items.reputation.items.push('boost-watermoon-technique');
    }

    if (reputation > REPUTATION_LEVELS.APPRECIATED) {
      items.reputation.items.push('boost-watermoon-defence');
      items.reputation.items.push('boost-watermoon-spell_power');
    }

    if (reputation > REPUTATION_LEVELS.RESPECTED) {
      items.reputation.items.push('boost-watermoon-rumble');
      items.reputation.items.push('boost-watermoon-scholar');
      items.reputation.items.push('boost-watermoon-mystic');
    }

    if (reputation >= REPUTATION_LEVELS.ESTEEMED) {
      items.reputation.items.push('equipment-accessories-watermoon-050_goldscale_ring');
    }

    return items;
  }

  /**
   * Get the Watermoon Reputation for this character.
   *
   * @param {Character} character - The character to get reputation for.
   *
   * @return {integer}
   */
  getReputation(character) {
    return character.getStat(STATS.REPUTATION_GAINED, STATS.WATERMOON_REPUTATION);
  }
}

module.exports = Exchange;