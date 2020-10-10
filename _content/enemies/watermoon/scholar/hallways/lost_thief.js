"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;

class LostThiefEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttackAction(20, { multiplier: 2, text: "%s distracts you and sneaks in to slice at your unprotected side for %s damage!%s" }),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-lost_thief',
      displayName: 'Lost Thief',
      description: "This miserable wretch was cast into the labyrinth for thieving, and rather than try to atone, he's continued trying, unsuccessfully, to steal what little he can from the labyrinth's inhabitants.",
    });

    this.stats.perLevel.goldMin = 0;
    this.stats.perLevel.goldMax = 0;
  }
}

module.exports = LostThiefEnemy;