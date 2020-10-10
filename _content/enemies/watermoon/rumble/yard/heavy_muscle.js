"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class HeavyMuscleEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DazeAction(20),
  BlindAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-heavy_muscle',
      displayName: "Heavy Muscle",
      description: "Each member of this group is just… huge.  Like, man or woman, young or old, they all need to buy several sizes larger than their frame due to all the muscles they’ve put on.  Take care not to get caught in a headlock!",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = HeavyMuscleEnemy;