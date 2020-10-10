"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction         = require('@mixins/enemy/actions/poison').PoisonAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const PoisonedKnives = PoisonAction(20, {
  strength: 50,
  text: ":syringe: %s slice you with fancy-looking knives, inflicting a seemingly minor wound.  However, after a few short moments you can feel the poison begin to set in!"
});

class PassagePythonsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PoisonedKnives,
  RecklessAttackAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-passage_pythons',
      displayName: "Passage Pythons",
      description: "These young men and women all have slicked-back hair, black leather jackets, and a bad attitude.  They carry short knives and cluster behind a leader, who sizes you up, then yells \"Passage Pythons rule!\" as he leads the charge towards you.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = PassagePythonsEnemy;