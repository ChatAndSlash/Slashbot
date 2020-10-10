"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class EtherealServantEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsEssenceCrystals(75, 3, 7),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-ethereal_servant',
      displayName: 'Ethereal Servant',
      description: "A ghostly, prim-and-proper butler floats in front of you, eyeing you menacingly, daring you to attack.",
      stats: {
        base: {
          dodge: 20,
        },
        perLevel: {
          // Less hp, but dodgier
          maxHp: 17,
        }
      },
    });
  }
}

module.exports = EtherealServantEnemy;