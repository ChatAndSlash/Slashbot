"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const CrippleAction       = require('@mixins/enemy/actions/cripple').CrippleAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const Cripple = CrippleAction(20, {
  text: "Brown Belt Squad surrounds you and focus on striking the same area over and over, crippling your %s by %s for %d turns!",
});

class BrownBeltSquadEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DazeAction(20),
  Cripple,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-brown_belt_squad',
      displayName: "Brown Belt Squad",
      description: "Not quite at the peak of their skills, but definitely with long years of training behind them, this group of martial artists all move confidently and quietly, working together to present a real challenge.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = BrownBeltSquadEnemy;