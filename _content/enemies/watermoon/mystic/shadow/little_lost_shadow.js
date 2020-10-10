"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class LittleLostShadowEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-little_lost_shadow',
      displayName: 'Little Lost Shadow',
      description: "This appears to be the shadow of a young child with a peaked cap.  It zips and flies around you, presenting a very difficult target to hit!",
      // Less hp, but dodgier
      stats: {
        base: {
          dodge: 20,
        },
        perLevel: {
          maxHp: 17,
        }
      },
    });
  }
}

module.exports = LittleLostShadowEnemy;