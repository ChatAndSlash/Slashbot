"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class CorpsebeetleEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-corpsebeetle',
      displayName: 'Corpsebeetle',
      description: "A nearby corpse beging moving as if it were about to stand, which doesn't really surprise you, given where you are.  What *does* suprise you is when a huge, black-shelled beetle bursts forth from it and attacks you!",
    });
  }
}

module.exports = CorpsebeetleEnemy;