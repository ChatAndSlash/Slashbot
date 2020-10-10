"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BrassBeetleEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttackAction(20, { multiplier: 2, text: "%s mauls you with its horn for %s damage!%s" }),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-brass_beetle',
      displayName: 'Brass Beetle',
      description: "The rear of this mechanical beetle is wide open, with whirring clockwork parts visible, while the front is a hard armoured plate and horn that it uses to both protect and attack with.",
    });

    this.stats.perLevel.goldMin = 6;
    this.stats.perLevel.goldMax = 8;
  }
}

module.exports = BrassBeetleEnemy;