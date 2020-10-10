"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const DefendAction        = require('@mixins/enemy/actions/defend').DefendAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ShiningEidolonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  DefendAction(30),
  DropsMoondrop(100, 2, 4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-shining_eidolon',
      displayName: 'Shining Eidolon',
      description: "Though clearly made of the same stuff of other Eidolons, this silvery phantasm _glows_, lit from inside by a strange energy.",
    });
  }
}

module.exports = ShiningEidolonEnemy;