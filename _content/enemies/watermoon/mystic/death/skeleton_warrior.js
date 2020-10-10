"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SkeletonWarriorEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-skeleton_warrior',
      displayName: 'Skeleton Warrior',
      description: "Holding a massive battle axe and standing a full six and a half feet tall, this skeleton strides arrogantly towards you.  Faintly, you can hear him making some kind of noise.  Is he humming his own theme song?",
    });
  }
}

module.exports = SkeletonWarriorEnemy;