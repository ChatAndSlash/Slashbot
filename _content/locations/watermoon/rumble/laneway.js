"use strict";

const { mix }               = require('mixwith');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { RumbleLocation }    = require('@mixins/location/rumble');
const { GreeterLocation }   = require('@mixins/location/greeter');
const { EventLocation }     = require('@mixins/location/event');

const { GROUP_TYPE_MIX, GROUP_TYPE_SOLOS, GROUP_TYPE_GROUPS } = require('@mixins/location/rumble');

const MINIBOSS_TYPE = 'watermoon-rumble-shadow_lesser';

/**
 * First rumble location.
 */
class LanewayLocation extends mix(WatermoonLocation).with(
  RumbleLocation(),
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway',
      displayName: __('Laneway'),
      description: "*Watermoon, Rumble District*\nThis laneway doesn't look too bad.  Sure, it's not exactly maintained very well, but anything this close to the fountain can't be *that* bad.",
      image: 'locations/watermoon/rumble.png',
      connectedLocations: [
        'watermoon-fountain',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
    });
  }

  /**
   * Populate enemy choices to randomly draw from.
   * This can be overridden in specific locations to add/remove enemies from the population based
   * on the character.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEnemies(character) {
    const isMinibossDefeated  = this.isMinibossDefeated(character);
    const areHenchmenDefeated = this.areHenchmenDefeated(character);

    if ( ! isMinibossDefeated && areHenchmenDefeated) {
      return [
        { value: MINIBOSS_TYPE, weight: 100 },
      ];
    }

    switch (this.getEnemyGroupType(character)) {
      case GROUP_TYPE_GROUPS:
        return [
          { value: 'watermoon-rumble-laneway-wheezing_cutter', weight: 5 },
          { value: 'watermoon-rumble-laneway-trembling_slicer', weight: 5 },
          { value: 'watermoon-rumble-laneway-fearful_mugger', weight: 5 },
          { value: 'watermoon-rumble-laneway-careful_thug', weight: 5 },
          { value: 'watermoon-rumble-laneway-confused_catburglar', weight: 5 },

          { value: 'watermoon-rumble-laneway-noob_poisoners', weight: 20 },
          { value: 'watermoon-rumble-laneway-young_bullies', weight: 20 },
          { value: 'watermoon-rumble-laneway-eager_initiates', weight: 20 },
          { value: 'watermoon-rumble-laneway-hesitant_oldsters', weight: 20 },
          { value: 'watermoon-rumble-laneway-lethargic_lightweights', weight: 20 },
        ];

      case GROUP_TYPE_SOLOS:
        return [
          { value: 'watermoon-rumble-laneway-wheezing_cutter', weight: 20 },
          { value: 'watermoon-rumble-laneway-trembling_slicer', weight: 20 },
          { value: 'watermoon-rumble-laneway-fearful_mugger', weight: 20 },
          { value: 'watermoon-rumble-laneway-careful_thug', weight: 20 },
          { value: 'watermoon-rumble-laneway-confused_catburglar', weight: 20 },

          { value: 'watermoon-rumble-laneway-noob_poisoners', weight: 5 },
          { value: 'watermoon-rumble-laneway-young_bullies', weight: 5 },
          { value: 'watermoon-rumble-laneway-eager_initiates', weight: 5 },
          { value: 'watermoon-rumble-laneway-hesitant_oldsters', weight: 5 },
          { value: 'watermoon-rumble-laneway-lethargic_lightweights', weight: 5 },
        ];

      case GROUP_TYPE_MIX:
        return [
          { value: 'watermoon-rumble-laneway-wheezing_cutter', weight: 10 },
          { value: 'watermoon-rumble-laneway-trembling_slicer', weight: 10 },
          { value: 'watermoon-rumble-laneway-fearful_mugger', weight: 10 },
          { value: 'watermoon-rumble-laneway-careful_thug', weight: 10 },
          { value: 'watermoon-rumble-laneway-confused_catburglar', weight: 10 },

          { value: 'watermoon-rumble-laneway-noob_poisoners', weight: 10 },
          { value: 'watermoon-rumble-laneway-young_bullies', weight: 10 },
          { value: 'watermoon-rumble-laneway-eager_initiates', weight: 10 },
          { value: 'watermoon-rumble-laneway-hesitant_oldsters', weight: 10 },
          { value: 'watermoon-rumble-laneway-lethargic_lightweights', weight: 10 },
        ];
    }
  }

  /**
   * Get the locations connected to this location.  Allows for custom logic on a per-location, per-character basis.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (this.isMinibossDefeated(character)) {
      locations.push('watermoon-rumble-alleyway');
    }

    return locations;
  }

  /**
   * Get the type of the intro encounter.
   *
   * @return {string}
   */
  getIntroEncounterType() {
    return 'watermoon-rumble-shadow_lesser_intro';
  }

  /**
   * Gets the number of henchmen required to defeat in this area.
   *
   * @param {Character} character - The character to check for henchmen total.
   *
   * @return {integer}
   */
  getTotalHenchmen(character) {
    return character.hasBoost('watermoon-rumble')
      ? 80
      : 100;
  }

  /**
   * Get the flag used to track miniboss defeat in this location.
   *
   * @return {string}
   */
  getMinibossType() {
    return MINIBOSS_TYPE;
  }

  /**
   * Get the average progress expected in this location.
   *
   * @return {string}
   */
  getExpectedAverageProgress() {
    return 3;
  }

  /**
   * Get the text for this location to display on the travel button.
   *
   * @param {Character} character - The character travelling.
   *
   * @return string
   */
  getButtonText(character) {
    return 'watermoon-fountain' === character.location.type
      ? __("Rumble District")
      : this.getDisplayName(character);
  }
}

module.exports = LanewayLocation;