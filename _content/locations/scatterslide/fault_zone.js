"use strict";

const ScatterslideLocation = require('@app/content/locations/scatterslide').ScatterslideLocation;

const FLAGS = require('@constants').FLAGS;

/**
 * The upper floors of the mines.
 */
class TheFaultZone extends ScatterslideLocation {
  constructor() {
    super({
      type: 'scatterslide-fault_zone',
      displayName: __('The Fault Zone'),
      image: 'locations/scatterslide/fault_zone.png',
      maxLevel: 20,
      connectedLocations: [
        'scatterslide-underdrift',
      ],
      encounters: [
        { value: 'fight', weight: 66 },
        { value: 'scatterslide-tracking', weight: 33 },
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
    let description = __("You can feel the weight of all the earth above you as this area periodially shakes around you, rocks and dust crashing down regularly.  Around you are various pockets of empty space, exposed by the constant shuddering and cave-ins.\n\n");

    if (character.hasKilledBrownDragon()) {
      description += __("With the Brown Dragon dead, there's more of a regularity to the crashes and shaking, making it possible to somewhat safely traverse the area.");
    }
    else {
      description += __("You're sure the Brown Dragon is hiding in one, but which one is it?");
    }

    return description;
  }

  /**
   * Only add Cursed Chest if Dragon hasn't been killed (no encounters after that point).
   *
   * @param {Character} character - The character to add the chest for.
   *
   * @return boolean
   */
  shouldAddCursedChest(character) {
    return super.shouldAddCursedChest(character) && ! character.hasKilledBrownDragon();
  }

  /**
   * If brown dragon killed, no encounters.
   * If character has done 5 tracking encounters, always encounter a fight.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEncounters(character) {
    if (character.hasKilledBrownDragon()) {
      return [];
    }

    if (this.getTracking(character) < 5) {
      return super.getEncounters(character);
    }

    return [ { value: 'fight', weight: 100 } ];
  }

  /**
   * If character has done 5 tracking encounters, always fight the Brown Dragon.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEnemies(character) {
    if (this.getTracking(character) < 5) {
      return [ { value: 'scatterslide-brown_drake', weight: 1 } ];
    }

    return [ { value: 'scatterslide-brown_dragon', weight: 1 } ];
  }

  /**
   * Get the number of times the character has tracked the brown dragon.
   *
   * @param {Character} character - The character tracking the brown dragon.
   *
   * @return {integer}
   */
  getTracking(character) {
    return character.getFlag(FLAGS.BROWN_DRAGON_TRACKING, 0);
  }

  // For brown dragon success, clear tracking flag
}

module.exports = TheFaultZone;