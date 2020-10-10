"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const MultiAttackAction    = require('@mixins/enemy/actions/multi_attack').MultiAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const Charge = RecklessAttackAction(20, {
  text: "%s charge you recklessly, dealing %s damage and taking %s damage in return!%s"
});

const FiringSquad = MultiAttackAction(20, {
  minAttacks: 3,
  maxAttacks: 3,
  multiplier: 0.75,
  preText: ":triumph: %s line up in a firing squad!",
  attackText: ":frowning: %s aim and shoot at you with precision, dealing %s damage.%s",
});

class ThreeFusiliersEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  Charge,
  FiringSquad,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-three_fusiliers',
      displayName: "Three Fusiliers",
      description: "Three young men saunter around the corner ahead of you, passionately arguing about wine, women, and politics.  They each carry a fusil, and are dressed in impractical, foppish attire. Before they attack you, they yell something along the lines of \"All for all, and one for one,\" then look at each other in confusion, shake their heads, and charge forwards.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
        PROPERTIES.RANGED_ATTACK,
      ]
    });
  }
}

module.exports = ThreeFusiliersEnemy;