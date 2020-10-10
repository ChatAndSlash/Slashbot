"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class StinkingBulkEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-stinking_bulk',
      displayName: 'Stinking Bulk',
      description: "While not quick, this monster is _huge_, and smells _terrible_, disgusting belches issuing forth from its froglike head every several seconds.",
    });
  }
}

module.exports = StinkingBulkEnemy;