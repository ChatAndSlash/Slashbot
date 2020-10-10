"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class EtherealGuardianEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsEssenceCrystals(100, 3, 7),
  DropsMoondrop(10),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-ethereal_guardian',
      displayName: 'Ethereal Guardian',
      description: "This terrifying ghostly being looks like a classic Valkyrie of old, including her menacing, all-too-real-looking spear!",
      stats: {
        base: {
          dodge: 25,
        },
        perLevel: {
          // Less hp, but dodgier
          maxHp: 20,
        }
      },
    });
  }
}

module.exports = EtherealGuardianEnemy;