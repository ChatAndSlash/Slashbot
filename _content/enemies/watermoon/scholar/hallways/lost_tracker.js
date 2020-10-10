"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;

class LostTrackerEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-lost_tracker',
      displayName: 'Lost Tracker',
      description: "This brave tracker followed her prey into the labyrinth, then got lost within its passages when her quarry doubled back, looped around, and lead her on a merry chase.",
    });

    this.stats.perLevel.goldMin = 0;
    this.stats.perLevel.goldMax = 0;
  }
}

module.exports = LostTrackerEnemy;