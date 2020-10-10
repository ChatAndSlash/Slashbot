"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class CreepingMistEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-creeping_mist',
      displayName: 'Creeping Mist',
      description: "For a few steps, you can feel something tugging gently at your legs.  You whirl around to watch a ghostly figure made of mist form into an amorphous shape near the ground.",
    });
  }
}

module.exports = CreepingMistEnemy;