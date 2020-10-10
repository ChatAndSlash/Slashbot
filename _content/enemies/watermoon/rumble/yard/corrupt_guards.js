"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class CorruptGuardsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DazeAction(20),
  BlindAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-corrupt_guards',
      displayName: "Corrupt Guards",
      description: "Brazenly still wearing their guardsmen’s uniform, these off-duty guards are willing to let you pass by for a price - your life!  Since it’s a given that you’d never accept such a deal, your only alternative is to fight.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = CorruptGuardsEnemy;