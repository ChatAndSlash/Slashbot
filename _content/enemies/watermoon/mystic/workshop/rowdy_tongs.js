"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class RowdyTongsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsEssenceCrystals(20, 1, 2),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-rowdy_tongs',
      displayName: 'Rowdy Tongs',
      description: "These tongs jump and cavort across the workshop, clamping on and charring anything they come near to.  Try not to get near them!",
      properties: [
        PROPERTIES.BURN_ATTACK,
      ],
      stats: {
        perLevel: {
          // Less damage because burn will make up for it
          minDamage: 0.75,
          maxDamage: 0.75,
        }
      },
    });
  }
}

module.exports = RowdyTongsEnemy;