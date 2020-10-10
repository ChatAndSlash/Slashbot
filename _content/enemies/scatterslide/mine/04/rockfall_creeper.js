"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction        = require('@mixins/enemy/actions/daze').DazeAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class RockfallCreeper extends mix(ScatterslideEnemy).with(
  FuriousAction(30),
  DazeAction(20),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-04-rockfall_creeper',
      displayName: __('Rockfall Creeper'),
      description: __("What you first take to be a dangerous rockfall, indicating structural weakness in the mine, is actually a huge dangerous insect *pretending* to only be... a dangerous... thing.  You're not sure how this camouflage is supposed to work, but your attention is quickly diverted not only by it's flailing limbs, but also by the glinting of what might be a gear, hanging on the monster!"),
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
      return new Loot(new LootSlot().addEntry(100, 'quest-intact_gear', 1, 2));
    }

    return new Loot();
  }
}

module.exports = RockfallCreeper;