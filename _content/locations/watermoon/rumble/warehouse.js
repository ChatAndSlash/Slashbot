"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const RumbleLocation    = require('@mixins/location/rumble').RumbleLocation;

const { GROUP_TYPE_MIX, GROUP_TYPE_SOLOS, GROUP_TYPE_GROUPS } = require('@mixins/location/rumble');

const { FLAGS } = require('@constants');

const MINIBOSS_TYPE = 'watermoon-rumble-red_dragon';

/**
 * Final rumble location.
 */
class WarehouseLocation extends mix(WatermoonLocation).with(RumbleLocation()) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse',
      displayName: "Warehouse",
      image: 'locations/watermoon/rumble.png',
      connectedLocations: [
        'watermoon-rumble-yard',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
    });
  }

  getDescription(character) {
    let description;

    if (character.hasKilledRedDragon()) {
      description = "*Watermoon, Rumble District*\nBoxes are stacked neatly against the walls, with none of the slovenly lack of care from the previous locations evidenced here.  Wide open spaces make it easy to move around, but this mainly aids the large groups of goons trying to surround you.";
    }
    else {
      description = "*Watermoon, Rumble District*\nBoxes are stacked neatly against the walls, with none of the slovenly lack of care from the previous locations evidenced here.  Wide open spaces make it easy to move around, but are very likely for the benefit of the Red Dragon herself.";
    }

    if (this.isMinibossDefeated(character)) {
      description += "\n\nYou've already cleaned up the henchmen from this area.  It's time to move on to the next!";
    }
    // If miniboss not defeated & intro has played, display henchmen remaining
    else if (this.getNumFights(character) > 0) {
      const total = this.getTotalHenchmen(character);
      const defeated = Math.min(total, this.getDefeatedHenchmen(character));
      const nice = 69 === defeated ? "  Nice." : "";

      description += `\n\nYou have defeated ${defeated} of ${total} henchmen.${nice}`;
    }

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
    if (character.hasKilledRedDragon()) {
      const isMinibossDefeated = this.isMinibossDefeated(character);
      const fights = this.getNumFights(character);

      // If we haven't defeated any henchmen in this location, placeholder introduction
      if ( ! isMinibossDefeated && 0 === fights) {
        return [{ value: 'watermoon-rumble-placeholder_intro', weight: 100 }];
      }
    }

    return super.getEncounters(character);
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
      // Already killed red dragon?  Encounter a rumble bonus boss
      if (character.hasKilledRedDragon()) {
        return [{ value: character.getFlag(FLAGS.RUMBLE_BOSS), weight: 1 }];
      }

      return [
        { value: MINIBOSS_TYPE, weight: 100 },
      ];
    }

    switch (this.getEnemyGroupType(character)) {
      case GROUP_TYPE_GROUPS:
        return [
          { value: 'watermoon-rumble-warehouse-aged_master', weight: 5 },
          { value: 'watermoon-rumble-warehouse-kung_fu_cop', weight: 5 },
          { value: 'watermoon-rumble-warehouse-massive_slapper', weight: 5 },
          { value: 'watermoon-rumble-warehouse-patient_yogi', weight: 5 },
          { value: 'watermoon-rumble-warehouse-dragon_karate_adept', weight: 5 },

          { value: 'watermoon-rumble-warehouse-crazed_groupies', weight: 20 },
          { value: 'watermoon-rumble-warehouse-painted_macemen', weight: 20 },
          { value: 'watermoon-rumble-warehouse-three_fusiliers', weight: 20 },
          { value: 'watermoon-rumble-warehouse-fourth_street_angels', weight: 20 },
          { value: 'watermoon-rumble-warehouse-passage_pythons', weight: 20 },
        ];

      case GROUP_TYPE_SOLOS:
        return [
          { value: 'watermoon-rumble-warehouse-aged_master', weight: 20 },
          { value: 'watermoon-rumble-warehouse-kung_fu_cop', weight: 20 },
          { value: 'watermoon-rumble-warehouse-massive_slapper', weight: 20 },
          { value: 'watermoon-rumble-warehouse-patient_yogi', weight: 20 },
          { value: 'watermoon-rumble-warehouse-dragon_karate_adept', weight: 20 },

          { value: 'watermoon-rumble-warehouse-crazed_groupies', weight: 5 },
          { value: 'watermoon-rumble-warehouse-painted_macemen', weight: 5 },
          { value: 'watermoon-rumble-warehouse-three_fusiliers', weight: 5 },
          { value: 'watermoon-rumble-warehouse-fourth_street_angels', weight: 5 },
          { value: 'watermoon-rumble-warehouse-passage_pythons', weight: 5 },
        ];

      case GROUP_TYPE_MIX:
        return [
          { value: 'watermoon-rumble-warehouse-aged_master', weight: 10 },
          { value: 'watermoon-rumble-warehouse-kung_fu_cop', weight: 10 },
          { value: 'watermoon-rumble-warehouse-massive_slapper', weight: 10 },
          { value: 'watermoon-rumble-warehouse-patient_yogi', weight: 10 },
          { value: 'watermoon-rumble-warehouse-dragon_karate_adept', weight: 10 },

          { value: 'watermoon-rumble-warehouse-crazed_groupies', weight: 10 },
          { value: 'watermoon-rumble-warehouse-painted_macemen', weight: 10 },
          { value: 'watermoon-rumble-warehouse-three_fusiliers', weight: 10 },
          { value: 'watermoon-rumble-warehouse-fourth_street_angels', weight: 10 },
          { value: 'watermoon-rumble-warehouse-passage_pythons', weight: 10 },
        ];
    }
  }

  /**
   * Get the type of the intro encounter.
   *
   * @return {string}
   */
  getIntroEncounterType() {
    return 'watermoon-rumble-red_dragon_intro';
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
      ? 400
      : 500;
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
    return 7;
  }
}

module.exports = WarehouseLocation;