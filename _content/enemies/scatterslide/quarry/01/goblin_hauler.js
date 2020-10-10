"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class GoblinHauler extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-01-goblin_hauler',
      displayName: 'Goblin Hauler',
      description: 'This burly goblin is weighed down with massive amounts of just... junk.  She could be a much tougher fight if she were willing to lay down any of her load, but thankfully for you, she\'s much too mistrusting for that.',
    });
  }

  /**
   * Returns the loot this enemy is carrying.
   *
   * @param {Character} character - The character that is fighting this enemy.
   *
   * @return object
   */
  getLoot(character) {
    if ( ! character.hasFlag(FLAGS.QUARRY_BLOWN_UP) && ! character.hasKilledBrownDragon()) {
      return new Loot(new LootSlot().addEntry(100, 'quest-crude_explosive', 1, 2));
    }

    return new Loot();
  }
}

module.exports = GoblinHauler;