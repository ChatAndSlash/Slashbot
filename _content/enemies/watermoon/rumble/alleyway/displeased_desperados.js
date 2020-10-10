"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class DispleasedDesperadosEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  RecklessAttackAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-displeased_desperados',
      displayName: "Displeased Desperados",
      description: "Wearing long gunbelts and even longer moustaches, these guys are right upset with you, and willing to make that known with violence.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
        PROPERTIES.RANGED_ATTACK,
      ]
    });
  }
}

module.exports = DispleasedDesperadosEnemy;