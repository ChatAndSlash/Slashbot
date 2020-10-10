"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const PoisonAction         = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ManticoreEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  RecklessAttackAction(20),
  PoisonAction(20),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-manticore',
      displayName: 'Manticore',
      description: "An inhuman scream heralds the presence of the terrifying manticore.  A powerful-looking lion body, a malicious-looking human head, and a scorpion tail dripping with poison all make up this monstrous beast.",
    });
  }
}

module.exports = ManticoreEnemy;