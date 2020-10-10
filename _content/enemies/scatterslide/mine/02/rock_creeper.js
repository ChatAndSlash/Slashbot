"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction        = require('@mixins/enemy/actions/daze').DazeAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class RockCreeper extends mix(ScatterslideEnemy).with(
  FuriousAction(25),
  DazeAction(10),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-02-rock_creeper',
      displayName: 'Rock Creeper',
      description: 'What looked like a large rock was actually a large creeper, a vicious insect with a shell that looks like a rock.  On its shell are several gears, hooked onto outcroppings.  Maybe one of them might be intact?',
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

module.exports = RockCreeper;