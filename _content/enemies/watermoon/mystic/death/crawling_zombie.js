"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

class CrawlingZombieEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-crawling_zombie',
      displayName: 'Crawling Zombie',
      description: "This zombie is missing its lower half and can only crawl slowly toward you, and absolutely cannot dodge.  Not exactly the most threatening enemy...",
      // Less HP
      stats: {
        perLevel: {
          maxHp: 15,
        }
      },
    });

    this.setFlag(FLAGS.CANNOT_DODGE);
  }
}

module.exports = CrawlingZombieEnemy;