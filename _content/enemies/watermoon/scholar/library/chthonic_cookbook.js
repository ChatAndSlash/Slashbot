"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const AcidSplashAction    = require('@mixins/enemy/actions/acid_splash').AcidSplashAction;
const DropsClues          = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ChthonicCookbookEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  AcidSplashAction(20),
  DropsClues(65, 1, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-chthonic_cookbook',
      displayName: 'Chthonic Cookbook',
      description: "None of the recipes in this book are safe for human consumption.  Most aren't even safe to cook in the first place.  The book *itself* is definitely not safe, so take care!",
    });
  }
}

module.exports = ChthonicCookbookEnemy;