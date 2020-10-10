"use strict";

const { mix }             = require('mixwith');
const { Location }        = require('@app/content/locations');
const { GreeterLocation } = require('@mixins/location/greeter');
const { EventLocation }   = require('@mixins/location/event');

const STATS = require('@constants').STATS;
const FLAGS = require('@constants').FLAGS;

/**
 * The forest.  The very first place you can go to fight.
 */
class Forest extends mix(Location).with(
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'tyrose-forest',
      displayName: "Forest",
      description: "You are in the forest adjacent to the City of Tyrose. ",
      image: 'locations/tyrose/forest.png',
      maxLevel: 4,
      canUseItems: true,
      connectedLocations: [
        'tyrose',
        'tyrose-forest-hermit_hut',
      ],
      encounters: [
        { value: 'fight',             weight: 93 },
        { value: 'lost_purse',        weight:  2 },
        { value: 'money_making_game', weight:  5 },
      ],
    });
  }

  /**
   * Get the number of dragon tracks encountered so far.
   *
   * @param {Character} character - The character exploring the forest.
   *
   * @return {integer}
   */
  getDragonTracks(character) {
    return character.getFlag(FLAGS.FOREST_DRAGON_TRACKS_COUNT, 0);
  }

  /**
   * Alter description based on how deep in the forest the character is.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    const dragonTracks = this.getDragonTracks(character);
    let additional = '';

    if (dragonTracks === 4) {
      additional = "You've tracked the dragon to this small but vicious section of the forest.  Its lair must be nearby.";
    }
    else if (dragonTracks === 3) {
      additional = "Thick branches hang down from overhead, obscuring your sight and making tracking difficult.";
    }
    else if (dragonTracks === 2) {
      additional = "The trees are a little closer here, blocking the light some.  You must peer closely at the ground to search for dragon tracks.";
    }
    else if (dragonTracks === 1) {
      additional = "Having found your first dragon tracks, you move a little deeper into the forest.";
    }

    return this._description + additional;
  }

  /**
   * Can't encounter greeter before level 3.
   *
   * @param {Character} character - The charcter in this location.
   *
   * @return {boolean}
   */
  shouldEncounterGreeter(character) {
    return character.level >= 3 && super.shouldEncounterGreeter(character);
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
    const tracksFound = this.getDragonTracks(character);
    let enemies = [
      { value: 'tyrose-forest-01-badger', weight: 1 },
      { value: 'tyrose-forest-01-boar', weight: 1 },
      { value: 'tyrose-forest-01-hawk', weight: 1 },
      { value: 'tyrose-forest-01-owl', weight: 1 },
      { value: 'tyrose-forest-01-viper', weight: 1 },
    ];

    if (tracksFound >= 1) {
      enemies = enemies.concat([
        { value: 'tyrose-forest-02-cougar', weight: 2 },
        { value: 'tyrose-forest-02-wolf', weight: 2 },
        { value: 'tyrose-forest-02-wolverine', weight: 2 },
      ]);
    }

    if (tracksFound >= 2) {
      enemies = enemies.concat([
        { value: 'tyrose-forest-03-black_bear', weight: 3 },
        { value: 'tyrose-forest-03-territorial_elk', weight: 3 },
      ]);
    }

    return enemies;
  }

  /**
   * Populate encounter choices.
   * Add encounters for cave discovery.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEncounters(character) {
    // Should character encounter trainer?
    if (character.profession.type === 'novice' && character.profession.spSpent === 0 && character.profession.sp > 0) {
      return [{ value: 'forest-trainer', weight: 100 }];
    }

    // Should character encounter the free wand?
    else if (character.level >= 3 && character.relic.type === 'equipment-relics-000_no_relic') {
      return [{ value: 'forest-find_wand', weight: 100 }];
    }

    // Should character encounter the cowardly apprentice??
    else if (character.level >= 4 && ! character.hasStat(STATS.RESCUED_APPRENTICE)) {
      return [{ value: 'forest-blacksmith_apprentice', weight: 100 }];
    }

    let choices = super.getEncounters(character);

    // If character hasn't discovered cave yet, populate dragon tracks
    if ( ! this.canTravelToCave(character)) {
      const dragonTracks = this.getDragonTracks(character);

      // Found enough dragon tracks to find the cave?
      if (dragonTracks === 4) {
        choices.push({ value: 'forest-discover_cave', weight: 50 });
      }

      // Having trouble finding dragon tracks (over-levelled)?
      else if (character.level > dragonTracks + 1) {
        choices.push({ value: 'forest-dragon_tracks', weight:  100 });
      }

      // Just high enough level to find another dragon track?
      else if (character.level > dragonTracks) {
        choices.push({ value: 'forest-dragon_tracks', weight:  50 });
      }
    }

    // If player hasn't encountered bandit clearing yet, add it
    if ( ! character.hasStat(STATS.BANDIT_CLEARING)) {
      choices.push({ value: 'forest-bandit_clearing', weight: 10 });
    }

    return choices;
  }

  /**
   * "Discovered" flag is cleared when green dragon is killed, but you can still travel to cave.
   *
   * @param {Character} character - The character in the forest.
   *
   * @return {boolean}
   */
  canTravelToCave(character) {
    return character.hasFlag(FLAGS.FOREST_CAVE_DISCOVERED) || character.hasKilledGreenDragon();
  }

  /**
   * Get the locations connected to this location.
   * If cave is discovered, add it.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (this.canTravelToCave(character)) {
      locations.splice(1, 0, 'tyrose-forest-cave');
    }

    return locations;
  }

  /**
   * Can't travel to Hermit's Hut until after you have a relic.
   *
   * @param {string} location - The type of the location to attempt to travel to.
   * @param {Character} character - The character doing the travelling, if there's custom logic for this location.
   *
   * @return {boolean}
   */
  canTravelTo(location, character) {
    if (location === 'tyrose-forest-hermit_hut') {
      return character.relic.type !== 'equipment-relics-000_no_relic';
    }

    return super.canTravelTo(location, character);
  }

  /**
   * Get the message that explains why a character would not be able to travel to a location.
   *
   * @param {string} location - The location being travelled to.
   * @param {Character} character - The character travelling.
   *
   * @return {string}
   */
  getTravelErrorMessage(location, character) {
    if (location === 'tyrose-forest-hermit_hut') {
      return ":warning: The hermit inside yells at you to go away, and mutters about how he can't train students who don't even have wands.";
    }

    return super.getTravelErrorMessage(location, character);
  }
}

module.exports = Forest;