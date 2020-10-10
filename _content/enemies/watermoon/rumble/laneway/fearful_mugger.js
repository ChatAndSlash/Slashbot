"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DefendAction        = require('@mixins/enemy/actions/defend').DefendAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class FearfulMuggerEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DefendAction(30),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-fearful_mugger',
      displayName: "Fearful Mugger",
      description: "You’re not quite able to make out what this young man is saying, but it’s probably something along the lines of “Give me your money!”",
    });
  }
}

module.exports = FearfulMuggerEnemy;