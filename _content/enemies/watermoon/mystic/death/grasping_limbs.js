"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class GraspingLimbsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-grasping_limbs',
      displayName: 'Grasping Limbs',
      description: "Arms and legs heave themselves up from beneath the ground, attempting to grasp and trip you.  Despite not being attached to any bodies, they still display intelligence and, unfortunately, malevolence.",
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = GraspingLimbsEnemy;