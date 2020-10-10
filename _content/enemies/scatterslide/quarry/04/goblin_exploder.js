"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const ExplodeAction     = require('@mixins/enemy/actions/explode').ExplodeAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class GoblinExploder extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  ExplodeAction(25, 0.25, 0.2),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-04-goblin_exploder',
      displayName: 'Goblin Exploder',
      description: "Gunpowder trails from this manic-looking Goblin as he shuffles towards you.  The flint he holds in his hand makes you nervous.  Well, that and the negligently dangerous amount of loose powder he carries on him.",
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
      return new Loot(new LootSlot().addEntry(100, 'quest-crude_explosive', 2, 3));
    }

    return new Loot();
  }
}

module.exports = GoblinExploder;