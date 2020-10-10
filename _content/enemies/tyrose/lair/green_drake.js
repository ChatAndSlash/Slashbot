"use strict";

const mix           = require('mixwith').mix;
const Enemy         = require('@app/content/enemies').Enemy;
const FuriousAction = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction  = require('@mixins/enemy/actions/poison').PoisonAction;
const Loot          = require('@app/loot').Loot;
const LootSlot      = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

const MAX_ACID_LOOTED = 10;

class GreenDrake extends mix(Enemy).with(FuriousAction(30), PoisonAction(20)) {
  constructor() {
    super({
      type: 'tyrose-lair-green_drake',
      displayName: 'Green Drake',
      description: 'Much smaller than the dragon it protects, this drake is still rather large. Its wingspan is easily eight feet across, and its tail is as long again. A triangle-shaped head sits on a long neck, and it snaps menacingly at you with long, sharp fangs.',
      levelBonus: 1,
      stats: {
        base: {
          maxHp: 75,
          defence: 5,
        },
        perLevel: {
          force: 1,
          defence: 1.5,
        }
      },
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
    if (character.getFlag(FLAGS.GREEN_DRAKE_ACID_LOOTED, 0) < MAX_ACID_LOOTED) {
      return new Loot().addSlot(
        'crystal_acid',
        new LootSlot().addEntry(25, 'catalyst-crystal_acid', 1, 2).addNothing(75)
      );
    }

    return new Loot();
  }

  /**
   * Save the number of Crystal Acid dropped by Green Drakes.
   *
   * @param {Character} character - The character who the loot was awarded to.
   * @param {integer} gold - The gold added.
   * @param {integer} scales - The number of scales added.
   * @param {array} loot - The loot added.
   */
  onFightLootAdded(character, gold, scales, loot) {
    const oldAmount = parseInt(character.getFlag(FLAGS.GREEN_DRAKE_ACID_LOOTED, 0));
    const addedAmount = loot.reduce((amount, entry) => {
      const entryQuantity = (entry.type === 'catalyst-crystal_acid') ? entry.quantity : 0;
      return amount + entryQuantity;
    }, 0);

    character.setFlag(FLAGS.GREEN_DRAKE_ACID_LOOTED, oldAmount + addedAmount);
  }
}

module.exports = GreenDrake;