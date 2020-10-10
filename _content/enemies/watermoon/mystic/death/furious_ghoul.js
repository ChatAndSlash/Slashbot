"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class FuriousGhoulEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(75),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-furious_ghoul',
      displayName: 'Furious Ghoul',
      description: "While mostly not as decomposed as other undead creatures, this ghoul has lost more of its mind.  It runs at you, using all four limbs as legs, howling in fury.",
    });
  }
}

module.exports = FuriousGhoulEnemy;