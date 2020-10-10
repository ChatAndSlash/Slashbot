"use strict";

const { mix }               = require('mixwith');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { RumbleLocation }    = require('@mixins/location/rumble');
const { GreeterLocation }   = require('@mixins/location/greeter');
const { EventLocation }     = require('@mixins/location/event');

const { GROUP_TYPE_MIX, GROUP_TYPE_SOLOS, GROUP_TYPE_GROUPS } = require('@mixins/location/rumble');

const MINIBOSS_TYPE = 'watermoon-rumble-jackie_mann';

/**
 * Third rumble location.
 */
class BackLotLocation extends mix(WatermoonLocation).with(
  RumbleLocation(),
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'watermoon-rumble-back_lot',
      displayName: __('Back Lot'),
      description: "*Watermoon, Rumble District*\nNice furniture has been left out in the elements to rot and fall apart.  A central couch is the most recent element, and is treated guest furniture, with none of the gang members seemingly allowed to sit in it.",
      image: 'locations/watermoon/rumble.png',
      connectedLocations: [
        'watermoon-rumble-alleyway',
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
          { value: 'watermoon-rumble-back_lot-aggressive_robber', weight: 5 },
          { value: 'watermoon-rumble-back_lot-combative_blackguard', weight: 5 },
          { value: 'watermoon-rumble-back_lot-contentious_knave', weight: 5 },
          { value: 'watermoon-rumble-back_lot-threatening_outcast', weight: 5 },
          { value: 'watermoon-rumble-back_lot-quarrelsome_thief', weight: 5 },

          { value: 'watermoon-rumble-back_lot-disturbed_scalawags', weight: 20 },
          { value: 'watermoon-rumble-back_lot-troubled_lowlifes', weight: 20 },
          { value: 'watermoon-rumble-back_lot-upset_vagabonds', weight: 20 },
          { value: 'watermoon-rumble-back_lot-anxious_pilferers', weight: 20 },
          { value: 'watermoon-rumble-back_lot-distraught_scoundrels', weight: 20 },
        ];

      case GROUP_TYPE_SOLOS:
        return [
          { value: 'watermoon-rumble-back_lot-aggressive_robber', weight: 20 },
          { value: 'watermoon-rumble-back_lot-combative_blackguard', weight: 20 },
          { value: 'watermoon-rumble-back_lot-contentious_knave', weight: 20 },
          { value: 'watermoon-rumble-back_lot-threatening_outcast', weight: 20 },
          { value: 'watermoon-rumble-back_lot-quarrelsome_thief', weight: 20 },

          { value: 'watermoon-rumble-back_lot-disturbed_scalawags', weight: 5 },
          { value: 'watermoon-rumble-back_lot-troubled_lowlifes', weight: 5 },
          { value: 'watermoon-rumble-back_lot-upset_vagabonds', weight: 5 },
          { value: 'watermoon-rumble-back_lot-anxious_pilferers', weight: 5 },
          { value: 'watermoon-rumble-back_lot-distraught_scoundrels', weight: 5 },
        ];

      case GROUP_TYPE_MIX:
        return [
          { value: 'watermoon-rumble-back_lot-aggressive_robber', weight: 10 },
          { value: 'watermoon-rumble-back_lot-combative_blackguard', weight: 10 },
          { value: 'watermoon-rumble-back_lot-contentious_knave', weight: 10 },
          { value: 'watermoon-rumble-back_lot-threatening_outcast', weight: 10 },
          { value: 'watermoon-rumble-back_lot-quarrelsome_thief', weight: 10 },

          { value: 'watermoon-rumble-back_lot-disturbed_scalawags', weight: 10 },
          { value: 'watermoon-rumble-back_lot-troubled_lowlifes', weight: 10 },
          { value: 'watermoon-rumble-back_lot-upset_vagabonds', weight: 10 },
          { value: 'watermoon-rumble-back_lot-anxious_pilferers', weight: 10 },
          { value: 'watermoon-rumble-back_lot-distraught_scoundrels', weight: 10 },
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
      locations.push('watermoon-rumble-yard');
    }

    return locations;
  }

  /**
   * Get the type of the intro encounter.
   *
   * @return {string}
   */
  getIntroEncounterType() {
    return 'watermoon-rumble-jackie_mann_intro';
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
      ? 240
      : 300;
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
    return 5;
  }
}

module.exports = BackLotLocation;