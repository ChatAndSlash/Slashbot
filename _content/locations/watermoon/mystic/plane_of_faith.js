"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const PlaneLocation     = require('@mixins/location/plane').PlaneLocation;

const PLANE_SIZE = 9;
//const MAX_PLANE_DISTANCE = 12.72;

/**
 * Plane of Faith.  Such gameplay!
 */
class PlaneOfFaithLocation extends mix(WatermoonLocation).with(PlaneLocation()) {
  constructor() {
    super({
      type: 'watermoon-mystic-plane_of_faith',
      displayName: __('Plane of Faith'),
      description: "*Watermoon, Mystic District*\nAll around you is a damp swamp, full of animals, insects, and foul smells.  From off in the distance, you can hear rhythmic chanting.",
      image: 'locations/watermoon/plane_of_faith.png',
      light: 25,
      connectedLocations: [
        'watermoon-mystic-lodge',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
      enemies: [
        { value: 'watermoon-mystic-faith-eyeless_horror', weight: 1 },
        { value: 'watermoon-mystic-faith-bloodwolf', weight: 1 },
        { value: 'watermoon-mystic-faith-bloodcrow', weight: 1 },
        { value: 'watermoon-mystic-faith-tunneler', weight: 1 },
        { value: 'watermoon-mystic-faith-evil_twin', weight: 1 },
        { value: 'watermoon-mystic-faith-slasher', weight: 1 },
        { value: 'watermoon-mystic-faith-vine_beast', weight: 1 },
        { value: 'watermoon-mystic-faith-possessed_groundskeeper', weight: 1 },
        { value: 'watermoon-mystic-faith-cult_priestess', weight: 1 },
        { value: 'watermoon-mystic-faith-fanatical_cultist', weight: 1 },
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
      : __("Without light, the mists of this plane seem to close in on you, obscuring your vision, providing enemies a chance to surprise you.");

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
    return 'faith';
  }

  /**
   * Get the enemy type of the boss.
   *
   * @param {Character} character - The character fighting the boss.
   *
   * @return {string}
   */
  getBossType(character) {
    return 'watermoon-mystic-faith-boss';
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
      // Boss has no bonus, which makes them 20% higher than regular enemies
      return super.getEnemyLevelBonus(enemy, character, type);
    }

    // Normal enemies have a 20% level reduction
    return Math.ceil(this.getEnemyLevel(enemy, character) * -0.2)
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

    if (distance > 9) {
      return __(":crystal_ball: You are very far from your target.");
    }
    else if (distance > 6) {
      return __(":crystal_ball: You are quite far from your target.");
    }
    else if (distance > 3) {
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
        [' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', '=', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', '=', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'R', 'R', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' ', ' '],
      ];
    }
    else if (1 === layout) {
      return [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'L', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'L', 'L', 'L', 'L', ' ', ' ', ' '],
        [' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' '],
        [' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', 'L', ' '],
        [' ', ' ', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' '],
        [' ', 'L', 'L', 'L', 'L', 'L', 'L', ' ', ' ', ' '],
        [' ', ' ', 'L', 'L', 'L', 'L', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'L', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ];
    }

    return [
      [' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' '],
      [' ', 'W', 'W', 'W', 'W', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', 'W', 'W', 'W', 'W', 'W', 'W', ' ', ' '],
      [' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', 'W', ' ', 'W', 'W', 'W', 'W', 'W', ' '],
      [' ', ' ', 'W', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' '],
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
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 0, y: 3 },
          { x: 1, y: 4 },
          { x: 3, y: 4 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 7, y: 0 },
          { x: 6, y: 1 },
          { x: 8, y: 1 },
          { x: 5, y: 3 },
          { x: 7, y: 4 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 2, y: 5 },
          { x: 1, y: 6 },
          { x: 3, y: 6 },
          { x: 1, y: 8 },
          { x: 3, y: 9 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 7, y: 5 },
          { x: 9, y: 6 },
          { x: 7, y: 7 },
          { x: 8, y: 8 },
          { x: 9, y: 9 },
        ];
      }
    }
    else if (1 === layout) {
      if (0 === quadrant) {
        return [
          { x: 1, y: 0 },
          { x: 3, y: 1 },
          { x: 0, y: 2 },
          { x: 2, y: 2 },
          { x: 1, y: 4 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 7, y: 0 },
          { x: 6, y: 1 },
          { x: 7, y: 1 },
          { x: 8, y: 2 },
          { x: 9, y: 3 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 1, y: 5 },
          { x: 0, y: 6 },
          { x: 1, y: 8 },
          { x: 4, y: 8 },
          { x: 2, y: 9 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 9, y: 6 },
          { x: 6, y: 7 },
          { x: 8, y: 7 },
          { x: 6, y: 9 },
          { x: 9, y: 9 },
        ];
      }
    }
    else if (2 === layout) {
      if (0 === quadrant) {
        return [
          { x: 2, y: 0 },
          { x: 0, y: 1 },
          { x: 3, y: 2 },
          { x: 1, y: 3 },
          { x: 3, y: 4 },
        ];
      }
      else if (1 === quadrant) {
        return [
          { x: 6, y: 0 },
          { x: 7, y: 1 },
          { x: 9, y: 1 },
          { x: 8, y: 2 },
          { x: 7, y: 4 },
        ];
      }
      else if (2 === quadrant) {
        return [
          { x: 1, y: 6 },
          { x: 3, y: 6 },
          { x: 4, y: 7 },
          { x: 1, y: 8 },
          { x: 2, y: 8 },
        ];
      }
      else if (3 === quadrant) {
        return [
          { x: 8, y: 5 },
          { x: 7, y: 7 },
          { x: 5, y: 8 },
          { x: 9, y: 8 },
          { x: 7, y: 9 },
        ];
      }
    }
  }
}

module.exports = PlaneOfFaithLocation;