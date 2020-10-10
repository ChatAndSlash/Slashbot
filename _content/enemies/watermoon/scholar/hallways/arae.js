"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class AraeEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CurseAction(20),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-arae',
      displayName: 'Arae',
      description: "This ghostly woman is doomed to wander the halls of the labyrinth, still casting the curses that relegated her to this underworld.",
    });
  }
}

module.exports = AraeEnemy;