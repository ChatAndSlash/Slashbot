"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ThreateningOutcastEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  DazeAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-back_lot-threatening_outcast',
      displayName: "Threatening Outcast",
      description: "Though she doesn’t sport gang colours and clearly is no longer affiliated with them, this young lady still holds an affinity for them and is defending their turf from invaders such as yourself.  You could almost admire such loyalty, if only it had been towards a more noble ideal.",
    });
  }
}

module.exports = ThreateningOutcastEnemy;