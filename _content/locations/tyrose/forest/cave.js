"use strict";

const Location = require('@app/content/locations').Location;

const FLAGS = require('@constants').FLAGS;
const STATS = require('@constants').STATS;

const EXPECTED_STARTING_LEVEL = 4;

/**
 * The forest cave.  The very second place you can go to fight.
 */
class Cave extends Location {
  constructor() {
    super({
      type: 'tyrose-forest-cave',
      displayName: __('Forest Cave'),
      description: __('You are in the cave found deep in the Tyrose Forest. '),
      image: 'locations/tyrose/cave.png',
      maxLevel: 7,
      connectedLocations: [
        'tyrose-forest',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
    });
  }

  /**
   * Get the number of dead ends encountered so far.
   *
   * @param {Character} character - The character exploring the cave.
   *
   * @return {integer}
   */
  getDeadEnds(character) {
    return character.getFlag(FLAGS.CAVE_DEAD_ENDS_COUNT, 0);
  }

  /**
   * Get the light level in the current location.
   * 0 Dead Ends found: 75
   * 1 Dead Ends found: 50
   * 2 Dead Ends found: 25
   * 3 Dead Ends found: 0
   *
   * @param {Character} character - The character in this location.
   *
   * @return {integer}
   */
  getLight(character) {
    return 100 - (this.getDeadEnds(character) + 1) * 25;
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
    const deadEnds = this.getDeadEnds(character);
    let enemies = [
      { value: 'tyrose-cave-01-bat_swarm', weight: 1 },
      { value: 'tyrose-cave-01-cave_wolf', weight: 1 },
      { value: 'tyrose-cave-01-rat_swarm', weight: 1 },
      { value: 'tyrose-cave-01-salamander', weight: 1 },
      { value: 'tyrose-cave-01-spiderling', weight: 1 },
    ];

    if (deadEnds >= 1) {
      enemies = enemies.concat([
        { value: 'tyrose-cave-02-boulder_beetle', weight: 2 },
        { value: 'tyrose-cave-02-creeping_ooze', weight: 2 },
        { value: 'tyrose-cave-02-giant_bat', weight: 2 },
      ]);
    }

    if (deadEnds >= 2) {
      enemies = enemies.concat([
        { value: 'tyrose-cave-03-grizzly_bear', weight: 3 },
        { value: 'tyrose-cave-03-wolf_spider', weight: 3 },
      ]);
    }

    return enemies;
  }

  /**
   * Alter description based on how deep in the cave the character is.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let additional = '';

    switch (this.getDeadEnds(character)) {
      case 0:
        additional  = __("You are still by the entrance");
        additional += character.hasLightSource()
          ? __(".  ") + character.getLightSourceDescription()
          : __(", and the light has only dimmed a little.  You may be surprised by monsters sneaking up on you.");
        break;

      case 1:
        additional = __("You are much deeper in");
        additional += character.hasLightSource()
          ? __(".  ") + character.getLightSourceDescription()
          : __(", and the light from the entrance is much dimmer.  You are likely to be surprised by monsters sneaking up on you.");
        break;

      case 2:
        additional = __("You are very deep inside");
        additional += character.hasLightSource()
          ? __(".  ") + character.getLightSourceDescription()
          : __(", and the light from the entrance is nearly non-existant.  You will frequently be surprised by monsters sneaking up on you.");
        break;

      case 3:
        additional = __("You are near the back of the cave");
        additional += character.hasLightSource()
          ? __(".  ") + character.getLightSourceDescription()
          : __(", and the light from the entrance is absent.  You *will* be surprised by monsters sneaking up on you.");
        break;
    }

    return this._description + additional;
  }

  /**
   * "Discovered" flag is cleared when green dragon is killed, but you can still travel to lair.
   *
   * @param {Character} character - The character in the cave.
   *
   * @return {boolean}
   */
  canTravelToLair(character) {
    return character.hasFlag(FLAGS.GREEN_LAIR_DISCOVERED) || character.hasKilledGreenDragon();
  }

  /**
   * Get the locations connected to this location.
   * If lair is discovered, add it.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (this.canTravelToLair(character)) {
      locations.push('tyrose-forest-cave-lair');
    }

    return locations;
  }

  /**
   * Populate encounter choices.
   * Add encounters for lair discovery.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEncounters(character) {
    // Should character encounter the cowardly apprentice??
    if (character.level >= 4 && ! character.hasStat(STATS.RESCUED_APPRENTICE)) {
      return [{ value: 'forest-blacksmith_apprentice', weight: 100 }];
    }

    // Should character encounter the ringmaker's tools?
    if (character.level >= 5 &&
      character.accessory.type === 'equipment-accessories-000_no_accessory' &&
      ! character.inventory.has('quest-ringmakers_tools')) {
      return [{ value: 'forest-cave-ringmakers_tools', weight: 100 }];
    }

    // Should character encounter the pet collar?
    if (character.level >= 6 &&
      character.pet.type === 'equipment-pets-000_no_pet' &&
      ! character.inventory.has('quest-pet_collar')) {
      return [{ value: 'forest-cave-pet_collar', weight: 100 }];
    }

    const deadEnds = this.getDeadEnds(character);
    let choices = super.getEncounters(character);

    // If character hasn't discovered lair yet, populate dead ends
    if ( ! this.canTravelToLair(character)) {
      // Found enough dead ends to find the lair?
      if (deadEnds === 3) {
        // If you have a light source, chance of discovering lair
        if (character.hasLightSource()) {
          choices.push({ value: 'forest-cave-discover_lair', weight: 50 });
        }

        // No light source?  Chance of getting clue to lair
        else {
          choices.push({ value: 'forest-cave-lair_clue', weight: 100 });
        }
      }

      // Having trouble finding dead end (over-levelled)?
      else if (character.level > deadEnds + EXPECTED_STARTING_LEVEL + 1) {
        choices.push({ value: 'forest-cave-dead_end', weight:  100 });
      }

      // High enough level to find another dead end?
      else if (character.level > deadEnds + EXPECTED_STARTING_LEVEL) {
        choices.push({ value: 'forest-cave-dead_end', weight:  50 });
      }
    }

    // If player hasn't encountered locked box yet, add it
    if ( ! character.hasStat(STATS.CAVE_LOCKED_BOX)) {
      choices.push({ value: 'forest-cave-locked_box', weight: (deadEnds + 1) * 25 });
    }

    return choices;
  }
}

module.exports = Cave;