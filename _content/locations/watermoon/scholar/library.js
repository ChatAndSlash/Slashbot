"use strict";

const { mix }               = require('mixwith');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { GreeterLocation }   = require('@mixins/location/greeter');
const { EventLocation }     = require('@mixins/location/event');

/**
 * Library where you obtain clues.
 */
class LibraryLocation extends mix(WatermoonLocation).with(
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library',
      displayName: __('Library'),
      description: "*Watermoon, Scholar District*\nHundreds of various magical tomes fly around you, none residing on the shelving they should.  Some swoop, some dive-bomb, and some outright attack you.  This is a dangerous place to be, but if you want to harvest Clues for the labyrinth below, there's nowhere else to go.",
      image: 'locations/watermoon/library.png',
      connectedLocations: [
        'watermoon-scholar-quad',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
      enemies: [
        { value: 'watermoon-scholar-library-agonizing_autobiography', weight: 10 },
        { value: 'watermoon-scholar-library-baleful_biography', weight: 10 },
        { value: 'watermoon-scholar-library-chthonic_cookbook', weight: 10 },
        { value: 'watermoon-scholar-library-demonic_dictionary', weight: 10 },
        { value: 'watermoon-scholar-library-enraged_encyclopedia', weight: 10 },
        { value: 'watermoon-scholar-library-glowering_grimoire', weight: 10 },
        { value: 'watermoon-scholar-library-jinxed_journal', weight: 10 },
        { value: 'watermoon-scholar-library-sinister_selfhelp_book', weight: 10 },
        { value: 'watermoon-scholar-library-terrifying_thesaurus', weight: 10 },
        { value: 'watermoon-scholar-library-twisted_textbook', weight: 10 },
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
    return super.getDescription(character) + __("\n\nYou have %d clues.", character.inventory.quantity('quest-watermoon-clue'));
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

module.exports = LibraryLocation;