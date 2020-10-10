"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class WoodsmokeShadeEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-woodsmoke_shade',
      displayName: 'Woodsmoke Shade',
      description: "You briefly smell burning wood before a figure coalesces out of the fog in front of you.  Though all one colour, a dark grey, it has the look of a giant log on fire, with chunky arms and legs.",
    });
  }
}

module.exports = WoodsmokeShadeEnemy;