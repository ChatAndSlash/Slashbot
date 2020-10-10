"use strict";

const { mix }               = require('mixwith');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { GreeterLocation }   = require('@mixins/location/greeter');
const { EventLocation }     = require('@mixins/location/event');

const { pluralize } = require('@util/text');

/**
 * Workshop.  Gather Essence Crystals here.
 */
class WorkshopLocation extends mix(WatermoonLocation).with(
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop',
      displayName: __('Workshop'),
      description: __("*Watermoon, Mystic District*\nThe High Magister's workshop is an absolute madhouse.  With the High Magister absent, experiments and magical assistants run wild, attacking everything that comes near, including each other!\n\nFrom time to time, you catch a glimpse of shadowy figures, Ethereal spirits, far more likely to have the Essence Crystals you require to power the planar portals elsewhere in the district."),
      image: 'locations/watermoon/workshop.png',
      connectedLocations: [
        'watermoon-mystic-plaza',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
      enemies: [
        { value: 'watermoon-mystic-workshop-wild_bellows', weight: 8 },
        { value: 'watermoon-mystic-workshop-mad_broom', weight: 8 },
        { value: 'watermoon-mystic-workshop-rowdy_tongs', weight: 8 },
        { value: 'watermoon-mystic-workshop-furious_book', weight: 9 },
        { value: 'watermoon-mystic-workshop-cinder_elemental', weight: 9 },
        { value: 'watermoon-mystic-workshop-alchemy_set', weight: 9 },
        { value: 'watermoon-mystic-workshop-magic_robes', weight: 9 },

        // Big droppers
        { value: 'watermoon-mystic-workshop-ethereal_tabby', weight: 13 },
        { value: 'watermoon-mystic-workshop-ethereal_servant', weight: 13 },
        { value: 'watermoon-mystic-workshop-ethereal_guardian', weight: 13 },
      ],
    });
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
    const crystals = character.inventory.quantity('quest-watermoon-essence_crystal');
    let description = super.getDescription(character);
    description += __('\n\nYou have collected %d %s', crystals, pluralize('Essence Crystal', crystals));

    return description;
  }

  /**
   * Populate encounter choices to randomly draw from.
   * This can be overridden in specific locations to add/remove encounters from the population
   * base on the character.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEncounters(character) {
    let encounters = super.getEncounters(character);

    if (character.accessory.type === 'equipment-accessories-watermoon-050_goldscale_ring') {
      encounters = character.accessory.addGoldDrakeEncounter(encounters);
    }

    return encounters;
  }
}

module.exports = WorkshopLocation;