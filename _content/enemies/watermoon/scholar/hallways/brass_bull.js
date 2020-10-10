"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BrassBullEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttackAction(20, { multiplier: 3, text: "%s charges you and pins you brutally against a wall for %s damage!%s" }),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-brass_bull',
      displayName: 'Brass Bull',
      description: "This huge mechanical beast is so massive that it can barely fit through the halls.  Once it gets up a head of steam, though, it can present a real problem to deal with!",
    });

    this.stats.perLevel.goldMin = 9;
    this.stats.perLevel.goldMax = 12;
  }
}

module.exports = BrassBullEnemy;