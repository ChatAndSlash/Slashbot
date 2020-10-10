"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class TrustedHenchwomanEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  StunAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-trusted_henchwoman',
      displayName: "Trusted Henchwoman",
      description: "This henchwoman wears a pleated skirt, a tailored jacket, and a shirt that says \"#1 Hench\".  You’re pretty sure she doesn’t know.",
    });
  }
}

module.exports = TrustedHenchwomanEnemy;