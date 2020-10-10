"use strict";

const { mix }               = require('mixwith');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { RumbleLocation }    = require('@mixins/location/rumble');
const { GreeterLocation }   = require('@mixins/location/greeter');
const { EventLocation }     = require('@mixins/location/event');

const { GROUP_TYPE_MIX, GROUP_TYPE_SOLOS, GROUP_TYPE_GROUPS } = require('@mixins/location/rumble');

const MINIBOSS_TYPE = 'watermoon-rumble-drunken_master';

/**
 * Second rumble location.
 */
class AlleywayLocation extends mix(WatermoonLocation).with(
  RumbleLocation(),
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway',
      displayName: __('Alleyway'),
      description: "*Watermoon, Rumble District*\nThe lighting is poor, the trash hasn't been swept away in a long time, and there's an odd smell permeating the air.  Still.  Not so bad for an alleyway.",
      image: 'locations/watermoon/rumble.png',
      connectedLocations: [
        'watermoon-rumble-laneway',
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
          { value: 'watermoon-rumble-alleyway-grumbling_gangster', weight: 5 },
          { value: 'watermoon-rumble-alleyway-annoyed_assaultist', weight: 5 },
          { value: 'watermoon-rumble-alleyway-exasperated_embezzeler', weight: 5 },
          { value: 'watermoon-rumble-alleyway-piqued_prowler', weight: 5 },
          { value: 'watermoon-rumble-alleyway-sullen_scapegrace', weight: 5 },

          { value: 'watermoon-rumble-alleyway-bitter_bandits', weight: 20 },
          { value: 'watermoon-rumble-alleyway-galled_goons', weight: 20 },
          { value: 'watermoon-rumble-alleyway-resentful_rapscallions', weight: 20 },
          { value: 'watermoon-rumble-alleyway-riled_ruffians', weight: 20 },
          { value: 'watermoon-rumble-alleyway-displeased_desperados', weight: 20 },
        ];

      case GROUP_TYPE_SOLOS:
        return [
          { value: 'watermoon-rumble-alleyway-grumbling_gangster', weight: 20 },
          { value: 'watermoon-rumble-alleyway-annoyed_assaultist', weight: 20 },
          { value: 'watermoon-rumble-alleyway-exasperated_embezzeler', weight: 20 },
          { value: 'watermoon-rumble-alleyway-piqued_prowler', weight: 20 },
          { value: 'watermoon-rumble-alleyway-sullen_scapegrace', weight: 20 },

          { value: 'watermoon-rumble-alleyway-bitter_bandits', weight: 5 },
          { value: 'watermoon-rumble-alleyway-galled_goons', weight: 5 },
          { value: 'watermoon-rumble-alleyway-resentful_rapscallions', weight: 5 },
          { value: 'watermoon-rumble-alleyway-riled_ruffians', weight: 5 },
          { value: 'watermoon-rumble-alleyway-displeased_desperados', weight: 5 },
        ];

      case GROUP_TYPE_MIX:
        return [
          { value: 'watermoon-rumble-alleyway-grumbling_gangster', weight: 10 },
          { value: 'watermoon-rumble-alleyway-annoyed_assaultist', weight: 10 },
          { value: 'watermoon-rumble-alleyway-exasperated_embezzeler', weight: 10 },
          { value: 'watermoon-rumble-alleyway-piqued_prowler', weight: 10 },
          { value: 'watermoon-rumble-alleyway-sullen_scapegrace', weight: 10 },

          { value: 'watermoon-rumble-alleyway-bitter_bandits', weight: 10 },
          { value: 'watermoon-rumble-alleyway-galled_goons', weight: 10 },
          { value: 'watermoon-rumble-alleyway-resentful_rapscallions', weight: 10 },
          { value: 'watermoon-rumble-alleyway-riled_ruffians', weight: 10 },
          { value: 'watermoon-rumble-alleyway-displeased_desperados', weight: 10 },
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
      locations.push('watermoon-rumble-back_lot');
    }

    return locations;
  }

  /**
   * Get the type of the intro encounter.
   *
   * @return {string}
   */
  getIntroEncounterType() {
    return 'watermoon-rumble-drunken_master_intro';
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
      ? 160
      : 200;
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
    return 4;
  }
}

module.exports = AlleywayLocation;