"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SlasherEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-slasher',
      displayName: 'Slasher',
      description: "This lithe, quick humanoid has one main feature: no hands!  Instead, its long arms are flat and tapered into cruel blades that it swipes at you with as it dashes past.",
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

module.exports = SlasherEnemy;