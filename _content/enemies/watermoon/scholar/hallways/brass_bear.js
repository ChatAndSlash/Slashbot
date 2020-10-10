"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PowerAttack = PowerAttackAction(20, {
  multiplier: 2,
  text: "%s swipes at you with its massive paws for %s damage!%s"
});

class BrassBearEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttack,
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-brass_bear',
      displayName: 'Brass Bear',
      description: "This stiff and clanking mechanical abomination may be slow, but if it catches you with a swing, it's definitely going to hurt!",
    });

    this.stats.perLevel.goldMin = 6;
    this.stats.perLevel.goldMax = 8;
  }
}

module.exports = BrassBearEnemy;