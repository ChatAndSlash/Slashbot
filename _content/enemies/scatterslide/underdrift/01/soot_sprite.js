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

const SpitFireAction = BurnAction(60, {
  isRanged: true,
  dodgeText: ":dash: %s spits fire at you but you dodge!",
  missText: "%s spits fire at you but misses!",
  attackText: ":fire: %s spits fire at you, dealing %s damage.%s"
});

class SootSprite extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  FallBackAction(20),
  SpitFireAction,
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-01-soot_sprite',
      displayName: 'Soot Sprite',
      description: 'This small, black, fuzzy-seeming creature was hiding in a seam in the wall.  It appears cute at first, but then it screams and starts spitting tiny sparks at you!',
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
      return new Loot(new LootSlot().addEntry(50, 'quest-chunky_key').addNothing(50));
    }

    return new Loot();
  }
}

module.exports = SootSprite;