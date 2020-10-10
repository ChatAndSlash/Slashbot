"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction        = require('@mixins/enemy/actions/berserk').BerserkAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ScreamingEidolonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  RecklessAttackAction(10),
  DropsMoondrop(100, 1, 2),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-screaming_eidolon',
      displayName: 'Screaming Eidolon',
      description: "From the moment it catches sight of you, this silvery phantasm dashes in, attacking you merciless and without pause or concern for itself.",
    });
  }
}

module.exports = ScreamingEidolonEnemy;