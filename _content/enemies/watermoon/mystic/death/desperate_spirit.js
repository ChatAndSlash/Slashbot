"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class DesperateSpiritEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-desperate_spirit',
      displayName: 'Desperate Spirit',
      description: "Your first clue that this enemy is upon you the feeling of desperation that emanates from it, so strong that you feel it yourself.  This spirit longs to live again, or failing that, consume some living flesh.",
    });
  }
}

module.exports = DesperateSpiritEnemy;