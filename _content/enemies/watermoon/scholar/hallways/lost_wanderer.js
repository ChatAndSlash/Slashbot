"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;

class LostWandererEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  RecklessAttackAction(30),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-lost_wanderer',
      displayName: 'Lost Wanderer',
      description: "Long ago, this reckless adventurer wandered into the labyrinth out of boredom or on a dare.  Either way, they've since become lost within its halls and bitterly attack any they encounter.",
    });

    this.stats.perLevel.goldMin = 0;
    this.stats.perLevel.goldMax = 0;
  }
}

module.exports = LostWandererEnemy;