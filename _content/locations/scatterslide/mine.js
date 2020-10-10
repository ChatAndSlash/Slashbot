"use strict";

const ScatterslideLocation = require('@app/content/locations/scatterslide').ScatterslideLocation;
const LootSlot             = require('@app/loot').LootSlot;
const Items                = require('@app/content/items').Items;
const Text                 = require('@util/text');

const FLAGS = require('@constants').FLAGS;
const STATS = require('@constants').STATS;

const ITEM_INTACT_GEAR = 'quest-intact_gear';

/**
 * The upper floors of the mines.
 */
class ScatterslideMine extends ScatterslideLocation {
  constructor() {
    super({
      type: 'scatterslide-mine',
      displayName: __('Mine'),
      image: 'locations/scatterslide/mine.png',
      maxLevel: 15,
      connectedLocations: [
        'scatterslide-quarry',
      ],
    });
  }

  /**
   * Alter description based on how deep in the mine the character is.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    const gears = this.getCountIntactGear(character);

    let description = __("The Scatterslide Mine, long abandoned now, has been completely taken over by the local fauna.  Creepy-crawlies of all kinds creep and crawl about, presenting an ever-present danger.\n\n");

    if (gears >= 18) {
      description += __("All but the most well-hidden gears deepest in the mine remain.\n\n");
      description += character.hasLightSource()
        ? character.getLightSourceDescription()
        : __("It is pitch dark. You will constantly be surprised by monsters sneaking up on you.");
    }
    else if (gears >= 12) {
      description += __("Having trouble finding gears now, you move even deeper in the mine.\n\n");
      description += character.hasLightSource()
        ? character.getLightSourceDescription()
        : __("There is barely any natural light. You will frequently be surprised by monsters sneaking up on you.");
    }
    else if (gears >= 6) {
      description += __("No more gears can be found near the entrance.  You are forced to search deeper in the mine.\n\n");
      description += character.hasLightSource()
        ? character.getLightSourceDescription()
        : __("Weak light from the entrance is all you have to see by. You are likely to be surprised by monsters sneaking up on you.");
    }
    else {
      description += character.hasLightSource()
        ? character.getLightSourceDescription()
        : __("Thin light filters in from the recently-exploded entrance. You may be surprised by monsters sneaking up on you.");
    }

    if (this.canTravelToUnderdrift(character)) {
      description += __("\n\nThere is a rickety elevator here, but having been recently repaired, it is perfectly capable of taking you to the depths of the mine.");
    }
    else {
      const gear = Items.new('quest-intact_gear');
      if (character.inventory.has('quest-intact_gear', gear.maxQuantity)) {
        description += __("\n\nThere is a rickety elevator here, in a sorry state of disrepair.  The drive mechanism can be repaired with the Intact Gears you have on hand.");
      }
      else {
        description += __("\n\nThere is a rickety elevator here, in a sorry state of disrepair.  The drive mechanism will require plenty of Intact Gears to repair it.");
        description += __("\nYou have %d Intact %s.", gears, Text.pluralize("Gear", gears));
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
    const gears = this.getCountIntactGear(character);
    let enemies = [
      { value: 'scatterslide-mine-01-bloodbat', weight: 1 },
      { value: 'scatterslide-mine-01-pebble_creeper', weight: 1 },
      { value: 'scatterslide-mine-01-pink_worm', weight: 1 },
      { value: 'scatterslide-mine-01-spider_swarm', weight: 1 },
    ];

    if (gears >= 6) {
      enemies = enemies.concat([
        { value: 'scatterslide-mine-02-gorebat', weight: 2 },
        { value: 'scatterslide-mine-02-purple_worm', weight: 2 },
        { value: 'scatterslide-mine-02-rock_creeper', weight: 2 },
      ]);
    }

    if (gears >= 12) {
      enemies = enemies.concat([
        { value: 'scatterslide-mine-03-scarlet_worm', weight: 4 },
        { value: 'scatterslide-mine-03-boulder_creeper', weight: 4 },
      ]);
    }

    if (gears >= 18) {
      enemies = enemies.concat([
        { value: 'scatterslide-mine-04-crimson_worm', weight: 8 },
        { value: 'scatterslide-mine-04-rockfall_creeper', weight: 8 },
      ]);
    }

    return enemies;
  }

  /**
   * Display Mine Elevator action button.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {array}
   */
  addMiscActions(character, actions) {
    if ( ! this.canTravelToUnderdrift(character)) {
      actions.addButton(__("Mine Elevator"), "start_encounter", { params: { type: 'scatterslide-repair' } });
    }

    return actions;
  }

  /**
   * Get the locations connected to this location.
   * If elevator is fixed or Brown Dragon is killed, add Underdrift.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (this.canTravelToUnderdrift(character)) {
      locations.push('scatterslide-underdrift');
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
    let fightWeight = 88;
    let encounters = [
      { value: 'scatterslide-stone_pile', weight: 5 },
      { value: 'scatterslide-scrap_equipment', weight: 5 },
      { value: 'scatterslide-leaky_canteen', weight: 2 }
    ];

    if ( ! character.knowsSpell('open_wounds')) {
      encounters.push({ value: 'scatterslide-scroll', weight: 5 });
      fightWeight -= 5;
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
        new LootSlot().addEntry(30, 'quest-stone_block', 1, 2).addNothing(70)
      );
    }

    // Add scrap metal to help build artificer
    if ( ! character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      loot.addSlot(
        'scrapMetal',
        new LootSlot().addEntry(30, 'quest-scrap_metal', 1, 2).addNothing(70)
      );
    }

    return loot;
  }

  /**
   * Get the light level in the current location.
   * 0-6 gears 0: 75
   * 7-12 gears: 50
   * 13-18 gears: 25
   * 19-25 gears: 0
   *
   * @param {Character} character - The character in this location.
   *
   * @return {integer}
   */
  getLight(character) {
    let light;
    const gears = this.getCountIntactGear(character);
    if (gears >= 18) {
      light = 0;
    }
    else if (gears >= 12) {
      light = 1;
    }
    else if (gears >= 6) {
      light = 2;
    }
    else {
      light = 3;
    }

    return light * 25;
  }

  /**
   * If the character can travel from the Mine to the Underdrift.
   *
   * @param {Character} character - The character doing the travelling.
   *
   * @return {boolean}
   */
  canTravelToUnderdrift(character) {
    return character.hasKilledBrownDragon() || character.hasFlag(FLAGS.MINE_ELEVATOR_FIXED);
  }

  /**
   * Get the amount of intact gears the character has collected.
   *
   * @param {Character} character - The character to get the count for.
   *
   * @return {integer}
   */
  getCountIntactGear(character) {
    return character.inventory.quantity(ITEM_INTACT_GEAR);
  }
}

module.exports = ScatterslideMine;