"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class PiquedProwlerEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BlindAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-piqued_prowler',
      displayName: "Piqued Prowler",
      description: "You barely even notice you’re being attacked as this lady dressed all in black sneaks out of a nearby alleyway, knife at the ready.",
    });
  }
}

module.exports = PiquedProwlerEnemy;