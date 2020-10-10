"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DefendAction        = require('@mixins/enemy/actions/defend').DefendAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class CarefulThugEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DefendAction(30),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-careful_thug',
      displayName: "Careful Thug",
      description: "Making each step with precision, this thug keeps a specific distance from you at all times, presumably the ideal distance from which to strike.",
    });
  }
}

module.exports = CarefulThugEnemy;