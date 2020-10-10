"use strict";

const { mix }               = require('mixwith');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { RumbleLocation }    = require('@mixins/location/rumble');
const { GreeterLocation }   = require('@mixins/location/greeter');
const { EventLocation }     = require('@mixins/location/event');

const { GROUP_TYPE_MIX, GROUP_TYPE_SOLOS, GROUP_TYPE_GROUPS } = require('@mixins/location/rumble');

const MINIBOSS_TYPE = 'watermoon-rumble-shadow_greater';

/**
 * Fourth rumble location.
 */
class YardLocation extends mix(WatermoonLocation).with(
  RumbleLocation(),
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard',
      displayName: __('Yard'),
      description: "*Watermoon, Rumble District*\nWhole weight-training assemblies litter this yard, obviously used to train the more impressive members of the gang.  You don't have long to appreciate them, however, as said gang members pour in from the outside.",
      image: 'locations/watermoon/rumble.png',
      connectedLocations: [
        'watermoon-rumble-back_lot',
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
          { value: 'watermoon-rumble-yard-aspiring_villain', weight: 5 },
          { value: 'watermoon-rumble-yard-trusted_henchman', weight: 5 },
          { value: 'watermoon-rumble-yard-trusted_henchwoman', weight: 5 },
          { value: 'watermoon-rumble-yard-assistant_assassin', weight: 5 },
          { value: 'watermoon-rumble-yard-victorious_pitfighter', weight: 5 },

          { value: 'watermoon-rumble-yard-corrupt_guards', weight: 20 },
          { value: 'watermoon-rumble-yard-accomplished_markswomen', weight: 20 },
          { value: 'watermoon-rumble-yard-respected_rooks', weight: 20 },
          { value: 'watermoon-rumble-yard-heavy_muscle', weight: 20 },
          { value: 'watermoon-rumble-yard-brown_belt_squad', weight: 20 },
        ];

      case GROUP_TYPE_SOLOS:
        return [
          { value: 'watermoon-rumble-yard-aspiring_villain', weight: 20 },
          { value: 'watermoon-rumble-yard-trusted_henchman', weight: 20 },
          { value: 'watermoon-rumble-yard-trusted_henchwoman', weight: 20 },
          { value: 'watermoon-rumble-yard-assistant_assassin', weight: 20 },
          { value: 'watermoon-rumble-yard-victorious_pitfighter', weight: 20 },

          { value: 'watermoon-rumble-yard-corrupt_guards', weight: 5 },
          { value: 'watermoon-rumble-yard-accomplished_markswomen', weight: 5 },
          { value: 'watermoon-rumble-yard-respected_rooks', weight: 5 },
          { value: 'watermoon-rumble-yard-heavy_muscle', weight: 5 },
          { value: 'watermoon-rumble-yard-brown_belt_squad', weight: 5 },
        ];

      case GROUP_TYPE_MIX:
        return [
          { value: 'watermoon-rumble-yard-aspiring_villain', weight: 10 },
          { value: 'watermoon-rumble-yard-trusted_henchman', weight: 10 },
          { value: 'watermoon-rumble-yard-trusted_henchwoman', weight: 10 },
          { value: 'watermoon-rumble-yard-assistant_assassin', weight: 10 },
          { value: 'watermoon-rumble-yard-victorious_pitfighter', weight: 10 },

          { value: 'watermoon-rumble-yard-corrupt_guards', weight: 10 },
          { value: 'watermoon-rumble-yard-accomplished_markswomen', weight: 10 },
          { value: 'watermoon-rumble-yard-respected_rooks', weight: 10 },
          { value: 'watermoon-rumble-yard-heavy_muscle', weight: 10 },
          { value: 'watermoon-rumble-yard-brown_belt_squad', weight: 10 },
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
      locations.push('watermoon-rumble-warehouse');
    }

    return locations;
  }

  /**
   * Get the type of the intro encounter.
   *
   * @return {string}
   */
  getIntroEncounterType() {
    return 'watermoon-rumble-shadow_greater_intro';
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
      ? 320
      : 400;
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
    return 6;
  }
}

module.exports = YardLocation;