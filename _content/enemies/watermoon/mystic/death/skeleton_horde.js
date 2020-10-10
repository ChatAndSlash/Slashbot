"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class SkeletonHordeEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-skeleton_horde',
      displayName: 'Skeleton Horde',
      description: "This clattering gang of skeletons is carrying rusty and broken weapons, and has only rudimentary armour.  They may not be well-equipped, but there sure are a lot of them.",
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = SkeletonHordeEnemy;