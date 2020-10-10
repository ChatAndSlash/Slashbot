"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BlackpoolSergeantEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BlindAction(10),
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-blackpool_sergeant',
      displayName: 'Blackpool Sergeant',
      description: "This hulking, grey-skinned man thunders up to you and stands in front of you, at the ready.  His black armour reflects no light, and has a stylized crimson \"P\" on the breast.",
      stats: {
        perLevel: {
          // High hp
          maxHp: 35,
        }
      },
    });
  }
}

module.exports = BlackpoolSergeantEnemy;