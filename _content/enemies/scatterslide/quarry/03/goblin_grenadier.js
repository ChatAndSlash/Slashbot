"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class GoblinGrenadier extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-03-goblin_grenadier',
      displayName: 'Goblin Grenadier',
      description: 'It\'s a bit of a stretch to call the home-made explosive strapped to this Goblin "grenades", but but they explode just fine, so really, she can call them whatever she wants.',
    });
  }

  /**
   * Returns the loot this enemy is carrying.
   *
   * @param {Character} character - The character that is fighting this enemy.
   *
   * @return {object}
   */
  getLoot(character) {
    if ( ! character.hasFlag(FLAGS.QUARRY_BLOWN_UP) && ! character.hasKilledBrownDragon()) {
      return new Loot(new LootSlot().addEntry(100, 'quest-crude_explosive', 2));
    }

    return new Loot();
  }
}

module.exports = GoblinGrenadier;