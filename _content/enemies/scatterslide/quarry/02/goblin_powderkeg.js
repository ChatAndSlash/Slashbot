"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class GoblinPowderkeg extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-02-goblin_powderkeg',
      displayName: 'Goblin Powderkeg',
      description: 'Careful, careful!  This goblin is strapped with explosives of all kind.  One wrong move and BAM!  That\'s it for both of you.',
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

module.exports = GoblinPowderkeg;