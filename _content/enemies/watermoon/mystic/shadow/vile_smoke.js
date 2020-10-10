"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class VileSmokeEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-vile_smoke',
      displayName: 'Vile Smoke',
      description: "Black smoke swirls up from the ground and forms into a menacing canine form.  When it roars, no sound can be heard, but thin black smoke comes out of its mouth.",
    });
  }
}

module.exports = VileSmokeEnemy;