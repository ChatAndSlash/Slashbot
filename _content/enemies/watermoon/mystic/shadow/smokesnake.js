"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConstrictAction     = require('@mixins/enemy/actions/constrict').ConstrictAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SmokeSnakeEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConstrictAction(10),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-smokesnake',
      displayName: 'Smokesnake',
      description: "Smoke swirls together along the ground, and though you expect it to turn into a giant beast or terrifying hominid, it instead stays low to the ground and keeps its sinuous, snakey form.",
    });
  }
}

module.exports = SmokeSnakeEnemy;