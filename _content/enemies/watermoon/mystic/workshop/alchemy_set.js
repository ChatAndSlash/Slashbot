"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction         = require('@mixins/enemy/actions/poison').PoisonAction;
const AcidSplashAction     = require('@mixins/enemy/actions/acid_splash').AcidSplashAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class AlchemySetEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(10),
  PoisonAction(15, { strength: 30 }),
  AcidSplashAction(15),
  DropsEssenceCrystals(30, 2, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-alchemy_set',
      displayName: 'Alchemy Set',
      description: "You almost walk past this seemingly-innocuous, when a beaker upends itself at you!  You manage to dodge, but while you're distracted, the glass, wood, and chemicals meld together to form a terrifying golem that attacks!",
    });
  }
}

module.exports = AlchemySetEnemy;