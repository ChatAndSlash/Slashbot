"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction        = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PoisonAttack = PoisonAction(30, {
  duration: 6,
  cooldown: 6,
  text: ":syringe: %s slice you, inflicting a seemingly minor wound.  However, after a few short moments you can feel poison from the blade begin to set in!",
});

const PROPERTIES = require('@constants').PROPERTIES;

class NoobPoisonersEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PoisonAttack,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-noob_poisoners',
      displayName: "Noob Poisoners",
      description: "Before engaging you, these young men and women very carefully apply a green liquid to their blades.  Subterfuge is very clearly not their strong suit.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = NoobPoisonersEnemy;