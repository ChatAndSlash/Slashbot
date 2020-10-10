"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class EtherealTabbyEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsEssenceCrystals(50, 3, 7),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-ethereal_tabby',
      displayName: 'Ethereal Tabby',
      description: "This isn't a cute kitty, but a wild, ghostly little feline that chases you around the workshop, yowling in anger.",
      stats: {
        base: {
          dodge: 15,
        },
        perLevel: {
          // Less hp, but dodgier
          maxHp: 15,
        }
      },
    });
  }
}

module.exports = EtherealTabbyEnemy;