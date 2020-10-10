"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const FallBackAction    = require('@mixins/enemy/actions/fall_back').FallBackAction;
const BurnAction        = require('@mixins/enemy/actions/burn').BurnAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

const SpitFireAction = BurnAction(40, {
  isRanged: true,
  dodgeText: ":dash: %s spits fire at you but you dodge!",
  missText: "%s spits fire at you but misses!",
  attackText: ":fire: %s spits fire at you, dealing %s damage.%s"
});

class CoalImp extends mix(ScatterslideEnemy).with(
  FuriousAction(35),
  FallBackAction(25),
  SpitFireAction,
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-04-coal_imp',
      displayName: 'Coal Imp',
      description: 'Heat radiates from this tiny, black-skinned creature that you originally took for a misshapen lump of coal.',
    });
  }

  /**
   * Get the description for this enemy and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting enemy description.
   *
   * @return array
   */
  getDescription(character) {
    const lightText = ! character.hasLightSource()
      ? __("  You can see a tiny glinting object that it seems to be holding.  It could be some gold, or perhaps a key?")
      : '';
    return this._description + lightText;
  }

  /**
   * Returns the loot this enemy is carrying.
   *
   * @param Character character The character that is fighting this enemy.
   *
   * @return object
   */
  getLoot(character) {
    if ( ! character.hasFlag(FLAGS.UNDERDRIFT_DOOR_UNLOCKED) && ! character.hasKilledBrownDragon() && character.hasLightSource()) {
      return new Loot(new LootSlot().addEntry(60, 'quest-chunky_key').addNothing(40));
    }

    return new Loot();
  }
}

module.exports = CoalImp;