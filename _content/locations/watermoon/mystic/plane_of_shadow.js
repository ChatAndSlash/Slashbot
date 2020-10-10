"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const PlaneLocation     = require('@mixins/location/plane').PlaneLocation;

const PLANE_SIZE = 19;
//const MAX_PLANE_DISTANCE = 26.87;

/**
 * Plane of Shadow.
 */
class PlaneOfShadowLocation extends mix(WatermoonLocation).with(PlaneLocation()) {
  constructor() {
    super({
      type: 'watermoon-mystic-plane_of_shadow',
      displayName: __('Plane of Shadow'),
      description: "*Watermoon, Mystic District*\nAll around you is a wispy, disorienting mist.  Shadowy figures move just beyond where you can see clearly.  What you can see is unsettling, but what you *can't* see is terrifying.",
      image: 'locations/watermoon/plane_of_shadow.png',
      light: 50,
      connectedLocations: [
        'watermoon-mystic-observatory',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
      enemies: [
        { value: 'watermoon-mystic-shadow-woodsmoke_shade', weight: 1 },
        { value: 'watermoon-mystic-shadow-foul_fog', weight: 1 },
        { value: 'watermoon-mystic-shadow-creeping_mist', weight: 1 },
        { value: 'watermoon-mystic-shadow-silent_hunter', weight: 1 },
        { value: 'watermoon-mystic-shadow-stinking_bulk', weight: 1 },
        { value: 'watermoon-mystic-shadow-howling_shade', weight: 1 },
        { value: 'watermoon-mystic-shadow-vile_smoke', weight: 1 },
        { value: 'watermoon-mystic-shadow-choking_smog', weight: 1 },
        { value: 'watermoon-mystic-shadow-smokesnake', weight: 1 },
        { value: 'watermoon-mystic-shadow-voidsnake', weight: 1 },
        { value: 'watermoon-mystic-shadow-little_lost_shadow', weight: 1 },
        { value: 'watermoon-mystic-shadow-mistblade', weight: 1 },
        { value: 'watermoon-mystic-shadow-blackpool_scholar', weight: 1 },
        { value: 'watermoon-mystic-shadow-blackpool_sergeant', weight: 1 },
        { value: 'watermoon-mystic-shadow-blackpool_defiant', weight: 1 },
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
      : __("Without light, the mists of this plane drastically limit your visibility, making it likely that enemies will surprise you.");

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
    return 'shadow';
  }

  /**
   * Get the enemy type of the boss.
   *
   * @param {Character} character - The character fighting the boss.
   *
   * @return {string}
   */
  getBossType(character) {
    return 'watermoon-mystic-shadow-boss';
  }

  /**
   * Get a location-based level bonus.
   *
   * @param {Enemy} enemy - The enemy to get the level bonus for.
   * @param {Character} character - The character in this location.
   * @param {string} type - The type of the enemy to check.
   *
   * @return {integer}
   */
  getEnemyLevelBonus(enemy, character, type) {
    if (this.isAtBoss(character)) {
      // Boss has 25% higher than regular enemy level bonus
      return Math.ceil(this.getEnemyLevel(enemy, character) * 0.25)
        + super.getEnemyLevelBonus(enemy, character, type);
    }

    // Normal enemies have no bonus
    return super.getEnemyLevelBonus(enemy, character, type);
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

    if (distance > 20) {
      return __(":crystal_ball: You are very far from your target.");
    }
    else if (distance > 12) {
      return __(":crystal_ball: You are quite far from your target.");
    }
    else if (distance > 6) {
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
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'T', ' ', ' ', ' ', 'T', ' ', ' ', 'R', 'R', ' ', ' ', ' ', 'F', 'F', 'F', ' ', ' ', ' ', ' '],
        [' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', 'F', 'F', 'F', 'F', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', 'F', 'F', 'F', ' ', ' ', ' '],
        [' ', ' ', ' ', 'T', ' ', ' ', ' ', ' ', ' ', 'L', 'L', ' ', ' ', ' ', ' ', 'F', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'T', ' ', ' ', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'T', ' ', ' ', ' ', ' ', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', 'F', 'F', 'F', ' ', ' '],
        [' ', 'T', ' ', ' ', 'T', ' ', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', 'F', 'F', 'F', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', 'F', 'F', ' ', ' '],
        [' ', ' ', 'T', ' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', 'F', ' ', ' '],
        [' ', ' ', ' ', 'T', ' ', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' '],
        [' ', 'T', ' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', 'F', 'F', ' ', ' '],
        [' ', ' ', ' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', 'F', 'F', ' ', ' '],
        [' ', ' ', ' ', 'T', ' ', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' '],
        [' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', 'L', 'L', ' ', ' ', ' ', ' ', 'F', ' ', ' ', 'F', 'F', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '=', ' ', ' ', ' ', 'F', 'F', 'F', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', 'F', 'F', 'F', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ];
    }
    else if (1 === layout) {
      return [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'F', 'F', 'F', ' ', ' ', ' ', 'W', ' ', ' ', 'F', 'F', ' ', ' ', ' ', ' '],
        [' ', ' ', 'W', 'W', 'W', 'W', 'W', 'F', ' ', ' ', 'F', 'W', 'F', 'F', 'F', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'F', 'F', 'W', ' ', ' ', ' ', 'F', 'W', 'F', ' ', ' ', 'W', ' ', ' ', ' ', ' '],
        [' ', 'F', ' ', ' ', 'F', 'F', 'W', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', 'F', ' ', ' '],
        ['F', 'F', ' ', ' ', 'F', 'F', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', 'F', 'F', ' ', ' '],
        ['F', 'F', ' ', ' ', ' ', 'F', 'W', ' ', ' ', ' ', ' ', ' ', ' ', 'F', 'F', 'W', 'F', 'F', ' ', ' '],
        [' ', ' ', ' ', 'W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'F', 'W', 'F', ' ', ' ', ' '],
        [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'W', 'F', ' ', ' ', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
        [' ', ' ', ' ', 'W', 'F', ' ', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'F', 'W', 'F', 'F', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'F', 'W', 'F', ' ', ' ', ' ', ' ', ' ', 'F', 'F', ' ', ' ', ' ', ' ', ' ', ' ', 'F', ' '],
        [' ', ' ', 'F', 'W', 'W', 'W', 'W', ' ', 'W', 'W', 'W', 'W', 'W', 'W', 'W', ' ', ' ', ' ', 'F', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', 'F', 'F', ' ', ' ', 'W', ' ', ' ', 'F', 'F', ' '],
        [' ', ' ', ' ', ' ', ' ', 'F', 'W', ' ', ' ', ' ', 'F', 'F', ' ', ' ', 'W', ' ', ' ', 'F', 'F', ' '],
        [' ', 'F', ' ', 'W', 'W', 'W', 'W', 'F', ' ', ' ', ' ', 'F', ' ', ' ', 'W', ' ', ' ', 'F', ' ', ' '],
        [' ', 'F', ' ', ' ', ' ', 'F', 'F', 'F', ' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', 'F', ' ', ' '],
        [' ', 'F', ' ', ' ', ' ', ' ', 'F', ' ', ' ', 'F', 'F', ' ', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ];
    }

    return [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'F', 'F', 'F', ' ', 'R', ' ', ' ', 'F', 'F', 'F'],
      [' ', 'T', ' ', ' ', ' ', ' ', 'T', 'F', 'F', 'F', 'F', 'F', ' ', ' ', '=', ' ', ' ', 'F', 'F', 'F'],
      [' ', 'F', 'F', 'T', ' ', ' ', ' ', 'F', 'F', 'F', 'F', 'F', ' ', 'R', 'R', ' ', ' ', 'T', 'F', 'F'],
      [' ', ' ', 'F', ' ', ' ', ' ', ' ', ' ', 'F', 'F', 'F', ' ', 'R', 'R', ' ', ' ', 'F', 'F', 'F', ' '],
      [' ', 'F', 'F', 'F', ' ', ' ', ' ', 'T', ' ', 'F', ' ', 'R', 'R', ' ', ' ', ' ', 'T', ' ', ' ', ' '],
      [' ', 'F', 'F', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', 'F', 'F', ' ', ' ', 'T', ' ', ' ', 'T', ' ', ' ', 'R', ' ', 'F', 'F', 'F', 'F', 'F', ' ', ' '],
      [' ', 'T', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', 'R', ' ', 'F', 'T', 'F', 'F', 'F', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'T', 'R', 'R', 'R', ' ', 'F', 'F', ' ', 'F', 'T', 'F', ' '],
      [' ', ' ', 'F', 'T', ' ', 'T', ' ', ' ', 'R', 'R', ' ', 'R', ' ', 'F', ' ', ' ', 'F', 'F', 'F', ' '],
      [' ', ' ', 'F', 'F', 'F', ' ', ' ', ' ', 'R', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', 'F', 'F'],
      [' ', ' ', 'T', 'F', 'F', ' ', ' ', ' ', 'R', ' ', 'T', ' ', '=', ' ', ' ', ' ', ' ', 'T', ' ', ' '],
      [' ', ' ', 'F', 'F', 'F', ' ', ' ', ' ', '=', ' ', ' ', ' ', 'R', 'R', 'F', 'F', 'F', ' ', ' ', ' '],
      [' ', ' ', 'T', 'F', 'F', 'T', ' ', ' ', 'R', 'R', ' ', ' ', 'F', 'R', 'T', 'F', ' ', ' ', ' ', 'T'],
      [' ', ' ', ' ', 'F', 'F', 'F', ' ', ' ', ' ', 'R', ' ', 'F', 'F', 'R', 'R', 'R', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', 'T', 'F', 'T', ' ', ' ', 'R', 'R', ' ', 'F', 'F', 'T', 'F', 'R', 'R', ' ', 'F', ' '],
      ['F', 'F', ' ', ' ', 'F', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', 'F', 'F'],
      [' ', 'F', 'T', ' ', ' ', 'T', ' ', '=', ' ', 'F', 'F', 'T', 'F', 'F', ' ', ' ', '=', ' ', 'F', 'F'],
      [' ', 'F', 'F', 'F', ' ', ' ', ' ', 'R', 'F', 'F', 'F', 'F', 'F', 'F', ' ', ' ', 'R', 'R', ' ', 'F'],
      [' ', ' ', 'F', 'F', ' ', ' ', 'F', 'R', 'F', 'F', 'T', 'F', 'F', ' ', ' ', ' ', ' ', 'R', ' ', ' '],
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
          { x: 2, y: 4 },
          { x: 2, y: 7 },
          { x: 3, y: 2 },
          { x: 4, y: 6 },
          { x: 6, y: 1 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 17, y: 1 },
          { x: 15, y: 2 },
          { x: 13, y: 4 },
          { x: 17, y: 5 },
          { x: 18, y: 7 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 11, y: 2 },
          { x: 11, y: 4 },
          { x: 14, y: 2 },
          { x: 16, y: 4 },
          { x: 18, y: 8 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 11, y: 18 },
          { x: 13, y: 13 },
          { x: 13, y: 16 },
          { x: 16, y: 13 },
          { x: 18, y: 12 },
        ];
      }
    }
    else if (1 === layout) {
      if (0 === quadrant) {
        return [
          { x: 0, y: 4 },
          { x: 3, y: 5 },
          { x: 4, y: 8 },
          { x: 7, y: 2 },
          { x: 7, y: 8 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 1, y: 15 },
          { x: 3, y: 17 },
          { x: 4, y: 14 },
          { x: 6, y: 11 },
          { x: 6, y: 17 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 11, y: 7 },
          { x: 12, y: 2 },
          { x: 15, y: 2 },
          { x: 18, y: 3 },
          { x: 18, y: 7 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 12, y: 12 },
          { x: 11, y: 16 },
          { x: 14, y: 18 },
          { x: 15, y: 11 },
          { x: 18, y: 13 },
        ];
      }
    }
    else if (2 === layout) {
      if (0 === quadrant) {
        return [
          { x: 1, y: 8 },
          { x: 4, y: 2 },
          { x: 5, y: 5 },
          { x: 6, y: 7 },
          { x: 8, y: 4 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 2, y: 12 },
          { x: 2, y: 15 },
          { x: 2, y: 18 },
          { x: 7, y: 12 },
          { x: 8, y: 18 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 11, y: 3 },
          { x: 14, y: 3 },
          { x: 14, y: 8 },
          { x: 15, y: 1 },
          { x: 18, y: 2 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 10, y: 15 },
          { x: 12, y: 15 },
          { x: 13, y: 18 },
          { x: 16, y: 14 },
          { x: 18, y: 12 },
        ];
      }
    }
  }
}

module.exports = PlaneOfShadowLocation;