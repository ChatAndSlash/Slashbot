"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction         = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const Poison = PoisonAction(20, {
  text: ":syringe: %s slices you, inflicting a seemingly minor wound.  However, after a few short moments you can feel poison from the blade begin to set in!",
});

class TroubledLowlifesEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  RecklessAttackAction(20),
  Poison,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-back_lot-troubled_lowlifes',
      displayName: "Troubled Lowlifes",
      description: "Originally, you pass this group lying down in street.  While thinking on their plight and how society has failed them, they rise up and attack you, clearly paid to do so by the leader of this area!",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = TroubledLowlifesEnemy;