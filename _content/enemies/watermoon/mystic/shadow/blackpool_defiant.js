"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BlackpoolDefiantEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(40),
  BlindAction(10, { duration: 3, cooldown: 4 }),
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-blackpool_defiant',
      displayName: 'Blackpool Defiant',
      description: "You don't understand the language this platinum-haired, silver-skinned woman says, but her proud posture and cruel smile makes her intentions obvious.  She wears ringmail made of an utterly black metal that has a stylized crimson \"P\" on the breast, and wields a perfectly black longsword.",
      // Medium-high hp and dodge
      stats: {
        base: {
          dodge: 10,
        },
        perLevel: {
          maxHp: 30,
        }
      },
    });
  }
}

module.exports = BlackpoolDefiantEnemy;