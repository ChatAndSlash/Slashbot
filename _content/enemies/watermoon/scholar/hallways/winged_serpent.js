"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const AcidSplashAction    = require('@mixins/enemy/actions/acid_splash').AcidSplashAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class WingedSerpentEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  AcidSplashAction(15),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-winged_serpent',
      displayName: 'Winged Serpent',
      description: "Soaring through the hallways on feathered wings, this serpent is extremely territorial and does not take kindly to unfamiliar faces wandering its halls.",
    });
  }
}

module.exports = WingedSerpentEnemy;