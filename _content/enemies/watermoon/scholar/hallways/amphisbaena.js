"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const AcidSplashAction    = require('@mixins/enemy/actions/acid_splash').AcidSplashAction;
const PoisonAction        = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class AmphisbaenaEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  AcidSplashAction(15),
  PoisonAction(20),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-amphisbaena',
      displayName: 'Amphisbaena',
      description: "A poisonous snake slithers into view from around a corner, followed quickly by its tail, which is actually another head - this one leaving a trail of acid behind it!",
    });
  }
}

module.exports = AmphisbaenaEnemy;