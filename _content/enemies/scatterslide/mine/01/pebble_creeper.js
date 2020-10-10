"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class PebbleCreeper extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-01-pebble_creeper',
      displayName: 'Pebble Creeper',
      description: 'This small but fierce insect has a shell that looks like a small, craggy rock.  It seems to have hooked some of the gears laying around here on it.  Maybe one of them might be intact?',
    });
  }

  /**
   * Get the description for this enemy and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting enemy description.
   *
   * @return {array}
   */
  getDescription(character) {
    const lightText = ! character.hasLightSource()
      ? __("  If only you had light enough to clearly examine them!")
      : '';
    return this._description + lightText;
  }

  /**
   * Returns the loot this enemy is carrying.
   *
   * @param {Character} character - The character that is fighting this enemy.
   *
   * @return {object}
   */
  getLoot(character) {
    if ( ! character.hasFlag(FLAGS.MINE_ELEVATOR_FIXED) && ! character.hasKilledBrownDragon() && character.hasLightSource()) {
      return new Loot(new LootSlot().addEntry(100, 'quest-intact_gear'));
    }

    return new Loot();
  }
}

module.exports = PebbleCreeper;