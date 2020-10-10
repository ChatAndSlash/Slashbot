"use strict";

const { mix }                  = require('mixwith');
const { ScatterslideLocation } = require('@app/content/locations/scatterslide');
const { GreeterLocation }      = require('@mixins/location/greeter');
const { EventLocation }        = require('@mixins/location/event');

const { LootSlot }  = require('@app/loot');
const { Items }     = require('@app/content/items');
const { pluralize } = require('@util/text');

const { CHARACTER_STATE, FLAGS, STATS } = require('@constants');

const ITEM_CRUDE_EXPLOSIVE = 'quest-crude_explosive';

class Quarry extends mix(ScatterslideLocation).with(
  GreeterLocation(),
  EventLocation(),
) {
  constructor() {
    super({
      type: 'scatterslide-quarry',
      buttonText: __("Quarry"),
      maxLevel: 11,
      image: 'locations/scatterslide/quarry.png',
      connectedLocations: [
        'scatterslide-campfire',
      ],
    });
  }

  /**
   * Get the display name of this location.
   *
   * @param {Character} character - The character to display the name to.
   *
   * @return {string}
   */
  getDisplayName(character) {
    return (_.isDefined(character) && CHARACTER_STATE.FIGHTING === character.state)
      ? __("Quarry")
      : __('Scatterslide Mines - Quarry');
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
    const explosives = this.getCountCrudeExplosives(character);
    let enemies = [
      { value: 'scatterslide-quarry-01-kobold_scavenger', weight: 1 },
      { value: 'scatterslide-quarry-01-goblin_patroller', weight: 1 },
      { value: 'scatterslide-quarry-01-kobold_ratcatcher', weight: 1 },
      { value: 'scatterslide-quarry-01-goblin_hauler', weight: 2 },
    ];

    if (explosives >= 10) {
      enemies = enemies.concat([
        { value: 'scatterslide-quarry-02-kobold_spearfisher', weight: 2 },
        { value: 'scatterslide-quarry-02-goblin_blacksmith', weight: 2 },
        { value: 'scatterslide-quarry-02-goblin_powderkeg', weight: 4 },
      ]);
    }

    if (explosives >= 20) {
      enemies = enemies.concat([
        { value: 'scatterslide-quarry-03-kobold_ratlord', weight: 4 },
        { value: 'scatterslide-quarry-03-goblin_grenadier', weight: 8 },
      ]);
    }

    if (explosives >= 30) {
      enemies = enemies.concat([
        { value: 'scatterslide-quarry-04-kobold_chef', weight: 8 },
        { value: 'scatterslide-quarry-04-goblin_exploder', weight: 16 },
      ]);
    }

    return enemies;
  }

  /**
   * Alter description based on how deep in the quarry the character is.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    const explosives = this.getCountCrudeExplosives(character);

    let description = __("The Scatterslide Quarry is, not to put too fine a point on it, a mess.  Tools and broken stone blocks litter the ground, abandoned in a hurry.\n\n");

    if (explosives >= 30) {
      description += __("The only remaining explosives are deep in the quarry.  The walls are tight and twisty, and powerful enemies stalk you.");
    }
    else if (explosives >= 20) {
      description += __("In order to find more explosives, you've moved even deeper into the quarry.  The walls are quite close, and powerful enemies stalk them.");
    }
    else if (explosives >= 10) {
      description += __("With the easy-to-find explosives near the entrance collected, you move further in.  The walls of the quarry are narrower here, and fiercer enemies take advantage of that fact.");
    }
    else {
      description +=__("The entrance to the quarry has wide walls and clear sightlines.  The enemies are not terribly challenging.");
    }

    if ( ! this.canTravelToMine(character)) {
      const explosive = Items.new('quest-crude_explosive');
      if (character.inventory.has('quest-crude_explosive', explosive.maxQuantity)) {
        description += __("\n\nThe entrance to the mine has been blocked off by a huge landslide.  There's no digging through that, but you feel you have enough Crude Explosives to blast it open.");
      }
      else {
        description += __("\n\nThe entrance to the mine has been blocked off by a huge landslide.  There's no digging through that, but if you gather more Crude Explosives, you should be able to blast it open.");
        description += __("\nYou have %d Crude %s.", explosives, pluralize("Explosive", explosives));
      }
    }
    else {
      description += __("\n\nThe entrance to the mine has been blown open, rocks scattered everywhere by the explosive you used to open it.");
    }

    return description;
  }

  /**
   * Get the locations connected to this location.
   * If mine is blown open, add it.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (this.canTravelToMine(character)) {
      locations.push('scatterslide-mine');
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
    // Force Greeter if necessary
    if (super.shouldEncounterGreeter(character)) {
      return super.getEncounters(character);
    }

    let fightWeight = 90;

    let encounters = [
      { value: 'scatterslide-stone_pile', weight: 5 },
      { value: 'scatterslide-scrap_equipment', weight: 5 }
    ];

    if ( ! character.hasStat(STATS.GOBLIN_CHILD)) {
      encounters.push({ value: 'scatterslide-goblin_child', weight: 10 });
      fightWeight -= 10;
    }

    encounters.push({ value: 'fight', weight: fightWeight });

    return encounters;
  }

  /**
   * Add a button for Explode encounter.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions -The Actions collection to add to.
   *
   * @return {array}
   */
  addMiscActions(character, actions) {
    if ( ! this.canTravelToMine(character)) {
      actions.addButton(__("Mine Entrance"), "start_encounter", { params: { type: 'scatterslide-explode' } });
    }

    return actions;
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
        new LootSlot().addEntry(25, 'quest-stone_block', 1, 2).addNothing(75)
      );
    }

    // Add scrap metal to help build artificer
    if ( ! character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      loot.addSlot(
        'scrapMetal',
        new LootSlot().addEntry(25, 'quest-scrap_metal', 1, 2).addNothing(75)
      );
    }

    return loot;
  }

  /**
   * If the character can travel from the Quarry to the Mine.
   *
   * @param {Character} character - The character doing the travelling.
   *
   * @return {boolean}
   */
  canTravelToMine(character) {
    return character.hasKilledBrownDragon() || character.hasFlag(FLAGS.QUARRY_BLOWN_UP);
  }

  /**
   * Get the amount of crude explosives the character has collected.
   *
   * @param {Character} character - The character to get the count for.
   *
   * @return {integer}
   */
  getCountCrudeExplosives(character) {
    return character.inventory.quantity(ITEM_CRUDE_EXPLOSIVE);
  }
}

module.exports = Quarry;