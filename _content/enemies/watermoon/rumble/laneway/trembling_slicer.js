"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DefendAction        = require('@mixins/enemy/actions/defend').DefendAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class TremblingSlicerEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DefendAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-trembling_slicer',
      displayName: "Trembling Slicer",
      description: "This young woman holds her knife in front of her as if she were afraid it might bite her.  This is clearly her first fight.",
    });
  }
}

module.exports = TremblingSlicerEnemy;