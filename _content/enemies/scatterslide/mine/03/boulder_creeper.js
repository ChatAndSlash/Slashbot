"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction        = require('@mixins/enemy/actions/daze').DazeAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;
const Loot              = require('@app/loot').Loot;
const LootSlot          = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

class BoulderCreeper extends mix(ScatterslideEnemy).with(
  FuriousAction(30),
  DazeAction(15),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-03-boulder_creeper',
      displayName: 'Boulder Creeper',
      description: 'This massive insect masquerades as a huge boulder to trick its prey into coming close enough to be eaten.  Thankfully, you weren\'t fooled, and noticed some of the gears hooked on its shell swaying from the creature\'s slight movement.  Maybe some of those gears might be intact?',
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

module.exports = BoulderCreeper;