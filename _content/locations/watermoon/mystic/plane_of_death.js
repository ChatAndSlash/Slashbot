"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const PlaneLocation     = require('@mixins/location/plane').PlaneLocation;

const PLANE_SIZE = 29;
//const MAX_PLANE_DISTANCE = 41.01;

/**
 * Plane of Shadow.
 */
class PlaneOfDeathLocation extends mix(WatermoonLocation).with(PlaneLocation()) {
  constructor() {
    super({
      type: 'watermoon-mystic-plane_of_death',
      displayName: __('Plane of Death'),
      description: "*Watermoon, Mystic District*\nA cold damp fog curls around your ankles and low moans sound from far away.  The smell of rot and decay fills your nose.  Fine to visit, but you certainly wouldn't want to live here.",
      image: 'locations/watermoon/plane_of_death.png',
      light: 75,
      connectedLocations: [
        'watermoon-mystic-mausoleum',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
      enemies: [
        { value: 'watermoon-mystic-death-shambling_zombie', weight: 1 },
        { value: 'watermoon-mystic-death-rotting_ghoul', weight: 1 },
        { value: 'watermoon-mystic-death-skeleton_horde', weight: 1 },
        { value: 'watermoon-mystic-death-corpsebeetle', weight: 1 },
        { value: 'watermoon-mystic-death-skeletal_canine', weight: 1 },
        { value: 'watermoon-mystic-death-furious_ghoul', weight: 1 },
        { value: 'watermoon-mystic-death-crawling_zombie', weight: 1 },
        { value: 'watermoon-mystic-death-fleshrender', weight: 1 },
        { value: 'watermoon-mystic-death-fleshmender', weight: 1 },
        { value: 'watermoon-mystic-death-corpse_butcher', weight: 1 },
        { value: 'watermoon-mystic-death-sewn_up_abomination', weight: 1 },
        { value: 'watermoon-mystic-death-wight_runner', weight: 1 },
        { value: 'watermoon-mystic-death-skeleton_warrior', weight: 1 },
        { value: 'watermoon-mystic-death-skeleton_ball', weight: 1 },
        { value: 'watermoon-mystic-death-ghostly_presence', weight: 1 },
        { value: 'watermoon-mystic-death-grasping_limbs', weight: 1 },
        { value: 'watermoon-mystic-death-desperate_spirit', weight: 1 },
        { value: 'watermoon-mystic-death-sorrowful_spirit', weight: 1 },
        { value: 'watermoon-mystic-death-corpseball', weight: 1 },
        { value: 'watermoon-mystic-death-banshee', weight: 1 },
      ],
    });
  }

  /**
   * Alter description based on if the character has a light source.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = super.getDescription(character) + "\n\n";

    description += character.hasLightSource()
      ? character.getLightSourceDescription()
      : __("Without light, the mists of this plane obscure your visibility greatly, making it highly likely you will be surprised.");

    return `${description}\n\n${this.getDistanceText(character)}`;
  }

  /**
   * Gets the type of this plane.
   *
   * @param {Character} character - The character to check.
   *
   * @return string
   */
  getPlaneType(character) {
    return 'death';
  }

  /**
   * Get the enemy type of the boss.
   *
   * @param {Character} character - The character fighting the boss.
   *
   * @return {string}
   */
  getBossType(character) {
    return 'watermoon-mystic-death-boss';
  }

  /**
   * Get a location-based level bonus.
   *
   * @param {Enemy} enemy - The enemy to get the level for.
   * @param {Character} character - The character in this location.
   * @param {string} type - The type of the enemy to check.
   *
   * @return {integer}
   */
  getEnemyLevelBonus(enemy, character, type) {
    if (this.isAtBoss(character)) {
      // Boss has 50% higher than regular enemy level bonus
      return Math.ceil(this.getEnemyLevel(enemy, character) * 0.5)
        + super.getEnemyLevelBonus(enemy, character, type);
    }

    // Normal enemies have 20% bonus
    return Math.ceil(this.getEnemyLevel(enemy, character) * 0.2)
      + super.getEnemyLevelBonus(enemy, character, type);
  }

  /**
   * Get text describing how far away the character is from their target.
   *
   * @param {Character} character - The character to get text for.
   *
   * @return {string}
   */
  getDistanceText(character) {
    const distance = this.getBossDistance(character);

    if (distance > 30) {
      return __(":crystal_ball: You are very far from your target.");
    }
    else if (distance > 20) {
      return __(":crystal_ball: You are quite far from your target.");
    }
    else if (distance > 10) {
      return __(":crystal_ball: You are fairly near to your target.");
    }
    else {
      return __(":crystal_ball: You are very nearly at your target!");
    }
  }

  /**
   * Get the size of this plane.
   *
   * @return {integer}
   */
  getPlaneSize() {
    return PLANE_SIZE;
  }

  /**
   * Get the tiles for the requested layout.
   *
   * @param {integer} layout - The layout requested.
   *
   * @param {array}
   */
  getTiles(layout) {
    if (0 === layout) {
      return [
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'T', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', 'W', 'W', 'W', 'W', 'W', 'D', 'D', 'W', 'W', 'W', 'W', 'W', 'W', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'T', ' ', 'R', 'R', ' ', ' ', 'T', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'D', ' ', ' ', 'D', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', 'T', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', 'T', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', 'W', 'W', 'W', 'D', 'W', 'W', 'W', ' ', ' ', ' '],
        [' ', ' ', 'T', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D', ' ', ' ', ' '],
        [' ', ' ', ' ', 'T', ' ', ' ', ' ', '=', ' ', ' ', ' ', 'T', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', 'W', 'W', 'D', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'D', 'W', 'W', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', 'T', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'T', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', 'T', ' ', ' ', ' ', '=', ' ', ' ', 'T', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', 'W', 'W', 'W', 'W', 'W', 'W', 'D', 'D', 'W', 'W', 'W', 'W', 'W', 'W', ' ', ' ', ' '],
        ['L', 'L', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', 'R', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', 'T', ' ', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', 'T', 'G', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', 'G', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ];
    }
    else if (1 === layout) {
      return [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', 'L', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', 'L', 'L', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'L', 'L', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', 'L', 'L'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' '],
        [' ', ' ', 'D', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'D', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', 'W', 'D', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', ' ', 'G', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'D', ' ', 'G', ' ', 'W', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', 'G', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', 'W', 'D', 'D', 'W', ' ', ' ', ' ', 'W', ' ', 'G', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', 'G', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'D', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', 'G', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'D', 'W', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' '],
        [' ', ' ', 'D', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'G', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' '],
        [' ', ' ', 'W', 'W', 'D', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'D', 'W', 'W', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ];
    }

    return [
      [' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', 'T', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', 'T', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' '],
      [' ', ' ', 'T', ' ', ' ', 'T', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', '=', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', 'T', ' '],
      [' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', 'T', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', 'T', ' ', 'T', 'T', ' ', ' ', 'T', ' ', ' ', ' '],
      [' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T', ' '],
      [' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'R', 'R', ' ', 'T', ' ', ' ', 'T', ' ', 'T', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'T', ' ', '=', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', 'T', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T'],
      ['T', ' ', ' ', 'W', 'W', 'W', 'W', 'D', 'W', 'W', 'W', 'W', 'R', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'D', 'W', 'W', 'W', 'W', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', 'R', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'W', 'T', ' '],
      [' ', 'T', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', 'R', 'R', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'W', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', 'T', ' '],
      [' ', ' ', 'T', 'W', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'R', 'R', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'W', ' ', ' '],
      [' ', ' ', ' ', 'D', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'D', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', 'R', 'R', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'W', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      [' ', 'T', ' ', 'W', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', '=', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'W', 'T', ' '],
      [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', 'R', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'G', ' ', 'W', ' ', ' '],
      [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', 'T'],
      [' ', ' ', 'T', 'W', 'W', 'W', 'W', 'D', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'R', 'W', 'W', 'W', 'W', 'W', 'W', 'D', 'W', 'W', 'W', 'W', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' '],
      [' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', 'T', 'R', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', 'T'],
    ];

  }

  /**
   * Get the possible locations to spawn player/boss.
   *
   * @param {integer} layout - The layout to choose from.
   * @param {integer} quadrant - the quadrant to choose from.
   *
   * @return {array}
   */
  getPossibleLocations(layout, quadrant) {
    if (0 === layout) {
      if (0 === quadrant) {
        return [
          { x: 5, y: 1 },
          { x: 12, y: 3 },
          { x: 2, y: 6 },
          { x: 9, y: 8 },
          { x: 3, y: 10 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 22, y: 0 },
          { x: 25, y: 3 },
          { x: 29, y: 3 },
          { x: 22, y: 5 },
          { x: 20, y: 10 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 4, y: 16 },
          { x: 10, y: 17 },
          { x: 7, y: 21 },
          { x: 11, y: 25 },
          { x: 13, y: 29 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 25, y: 16 },
          { x: 28, y: 20 },
          { x: 25, y: 21 },
          { x: 24, y: 26 },
          { x: 19, y: 28 },
        ];
      }
    }
    else if (1 === layout) {
      if (0 === quadrant) {
        return [
          { x: 9, y: 1 },
          { x: 7, y: 3 },
          { x: 2, y: 5 },
          { x: 11, y: 7 },
          { x: 6, y: 10 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 9, y: 1 },
          { x: 7, y: 3 },
          { x: 2, y: 5 },
          { x: 11, y: 7 },
          { x: 6, y: 10 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 18, y: 4 },
          { x: 25, y: 5 },
          { x: 20, y: 8 },
          { x: 25, y: 9 },
          { x: 26, y: 12 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 7, y: 19 },
          { x: 13, y: 19 },
          { x: 11, y: 25 },
          { x: 5, y: 25 },
          { x: 1, y: 28 },
        ];
      }
    }
    else if (2 === layout) {
      if (0 === quadrant) {
        return [
          { x: 11, y: 2 },
          { x: 5, y: 4 },
          { x: 8, y: 8 },
          { x: 5, y: 11 },
          { x: 9, y: 13 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 20, y: 0 },
          { x: 16, y: 4 },
          { x: 22, y: 4 },
          { x: 27, y: 6 },
          { x: 20, y: 10 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 6, y: 20 },
          { x: 6, y: 23 },
          { x: 2, y: 24 },
          { x: 6, y: 28 },
          { x: 11, y: 29 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 20, y: 18 },
          { x: 24, y: 19 },
          { x: 25, y: 23 },
          { x: 29, y: 24 },
          { x: 25, y: 27 },
        ];
      }
    }
  }
}

module.exports = PlaneOfDeathLocation;