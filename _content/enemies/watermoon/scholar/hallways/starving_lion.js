"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class StarvingLionEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-starving_lion',
      displayName: 'Starving Lion',
      description: 'While you can nearly count this lion\'s ribs, the fact that it is starving only serves to make it more dangerous, not less.  Judging by the scars it has accumulated, it has clearly slain many previous heroes when searching for a meal.',
    });
  }
}

module.exports = StarvingLionEnemy;