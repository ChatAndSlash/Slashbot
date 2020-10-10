"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BrassBoarEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttackAction(20, { multiplier: 2, text: "%s gores you with its tusks for %s damage!%s" }),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-brass_boar',
      displayName: 'Brass Boar',
      description: "Though it moves with a clockwork lack of grace, this boar has thick brass armour and long, sharp tusks, and can move with a surprising and dangerous speed.",
    });

    this.stats.perLevel.goldMin = 6;
    this.stats.perLevel.goldMax = 8;
  }
}

module.exports = BrassBoarEnemy;