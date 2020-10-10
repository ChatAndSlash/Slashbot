"use strict";

const ScatterslideLocation = require('@app/content/locations/scatterslide').ScatterslideLocation;
const LootSlot             = require('@app/loot').LootSlot;
const Items                = require('@app/content/items').Items;
const Text                 = require('@util/text');

const FLAGS = require('@constants').FLAGS;
const STATS = require('@constants').STATS;

const ITEM_CHUNKY_KEY = 'quest-chunky_key';

/**
 * The lowest parts of the mine.
 */
class TheUnderdrift extends ScatterslideLocation {
  constructor() {
    super({
      type: 'scatterslide-underdrift',
      displayName: __('The Underdrift'),
      image: 'locations/scatterslide/underdrift.png',
      maxLevel: 19,
      connectedLocations: [
        'scatterslide-mine',
      ],
    });
  }

  /**
   * Alter description based on how deep in the Underdrift the character is.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = __("The Underdrift is the deepest part of the Scatterslide Mine  The richest veins can be found here, so long as you can contend with the beasties that also make this their home.\n\n");

    description += character.hasLightSource()
      ? character.getLightSourceDescription()
      : __("Without light, you can see practically nothing.  You are sure to be surprised by any enemy wandering about.");

    if (character.hasLightSource()) {
      if (character.hasKilledBrownDragon()) {
        description += __("\n\nA giant door stands open here, but fallen rocks spill out of it, blocking the entrance.");
      }
      else if (this.canTravelToFaultZone(character)) {
        description += __("\n\nA giant door stands open here, opened hefty locks discarded on the floor around it.");
      }
      else {
        const key = Items.new('quest-chunky_key');
        if (character.inventory.has('quest-chunky_key', key.maxQuantity)) {
          description += __("\n\nA giant door stands closed here, sealed shut with dozens of hefty locks.  You're pretty sure you have enough keys to open it.");
        }
        else {
          const keys = this.getCountChunkyKeys(character);
          description += __("\n\nA giant door stands closed here, sealed shut with more hefty locks.  You recall seeing particularly chunky keys around here somwhere.  Surely those would be helpful.");
          description += __("\nYou have %d Chunky %s.", keys, Text.pluralize("Key", keys));
        }
      }
    }

    return description;
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
    const keys = this.getCountChunkyKeys(character);

    let enemies = [
      { value: 'scatterslide-underdrift-01-giant_centipede', weight: 1 },
      { value: 'scatterslide-underdrift-01-spider_horde', weight: 1 },
      { value: 'scatterslide-underdrift-01-yellow_worm', weight: 1 },
      { value: 'scatterslide-underdrift-01-soot_sprite', weight: 2 },
    ];

    if (keys >= 4) {
      enemies = enemies.concat([
        { value: 'scatterslide-underdrift-02-enormous_centipede', weight: 2 },
        { value: 'scatterslide-underdrift-02-orange_worm', weight: 2 },
        { value: 'scatterslide-underdrift-02-char_shade', weight: 3 },
      ]);
    }

    if (keys >= 8) {
      enemies = enemies.concat([
        { value: 'scatterslide-underdrift-03-colossal_centipede', weight: 4 },
        { value: 'scatterslide-underdrift-03-red_worm', weight: 4 },
        { value: 'scatterslide-underdrift-03-ash_spook', weight: 6 },
      ]);
    }

    if (keys >= 12) {
      enemies = enemies.concat([
        { value: 'scatterslide-underdrift-04-brown_worm', weight: 8 },
        { value: 'scatterslide-underdrift-04-coal_imp', weight: 12 },
      ]);
    }

    if (keys >= 16) {
      enemies = enemies.concat([
        { value: 'scatterslide-underdrift-05-black_worm', weight: 12 },
        { value: 'scatterslide-underdrift-05-smoke_demon', weight: 18 },
      ]);
    }

    return enemies;
  }

  /**
   * Display Giant Door encounter button.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {array}
   */
  addMiscActions(character, actions) {
    if ( ! this.canTravelToFaultZone(character)) {
      actions.addButton(__("Giant Door"), "start_encounter", { params: { type: 'scatterslide-unlock' } });
    }

    return actions;
  }

  /**
   * Get the locations connected to this location.
   * If door is opened, add Fault Zone.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (character.hasFlag(FLAGS.UNDERDRIFT_DOOR_UNLOCKED)) {
      locations.push('scatterslide-fault_zone');
    }

    return locations;
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
    let fightWeight = 90;
    let encounters = [
      { value: 'scatterslide-stone_pile', weight: 5 },
      { value: 'scatterslide-scrap_equipment', weight: 5 }
    ];

    if ( ! character.knowsSpell('poison_cloud')) {
      encounters.push({ value: 'scatterslide-scroll', weight: 5 });
      fightWeight -= 5;
    }

    if ( ! character.hasStat(STATS.CREEPY_HOLE)) {
      encounters.push({ value: 'scatterslide-creepy_hole', weight: 10 });
      fightWeight -= 10;
    }

    encounters.push({ value: 'fight', weight: fightWeight });

    return encounters;
  }

  /**
   * Chance to add some stone if the blacksmith hasn't been built yet or scrap metal if artificer
   * hasn't been built yet.
   *
   * @param {Character} character - The character getting the loot.
   * @param {Enemy} enemy - The enemy dropping the loot.
   *
   * @return {object}
   */
  getLoot(character, enemy) {
    let loot = enemy.getLoot(character);

    // Add stone block to help build blacksmith
    if ( ! character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)) {
      loot.addSlot(
        'stoneBlocks',
        new LootSlot().addEntry(35, 'quest-stone_block', 1, 2).addNothing(65)
      );
    }

    // Add scrap metal to help build artificer
    if ( ! character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      loot.addSlot(
        'scrapMetal',
        new LootSlot().addEntry(35, 'quest-scrap_metal', 1, 2).addNothing(65)
      );
    }

    return loot;
  }

  /**
   * Get the light level in the current location.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {integer}
   */
  getLight(character) {
    return 0;
  }

  /**
   * If the character can travel from the Underdrift to the Fault Zone.
   *
   * @param {Character} character - The character doing the travelling.
   *
   * @return {boolean}
   */
  canTravelToFaultZone(character) {
    return character.hasKilledBrownDragon() || character.hasFlag(FLAGS.UNDERDRIFT_DOOR_UNLOCKED);
  }

  /**
   * Get the amount of Chunky Keys the character has collected.
   *
   * @param {Character} character - The character to get the count for.
   *
   * @return {integer}
   */
  getCountChunkyKeys(character) {
    return character.inventory.quantity(ITEM_CHUNKY_KEY);
  }
}

module.exports = TheUnderdrift;