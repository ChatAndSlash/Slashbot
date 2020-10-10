"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction        = require('@mixins/enemy/actions/concuss').ConcussAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class TrustedHenchmanEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  RecklessAttackAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-trusted_henchman',
      displayName: "Trusted Henchman",
      description: "This henchman wears pleated pants, a tailored jacket, and a shirt that says \"#1 Hench\".  You’re pretty sure he doesn’t know.",
    });
  }
}

module.exports = TrustedHenchmanEnemy;