"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class WildBellowsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsEssenceCrystals(20, 1, 2),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-wild_bellows',
      displayName: 'Wild Bellows',
      description: "You wouldn't think a simple bellows would be able to hurt you that badly, but the winds issuing forth from this one slice through your armour with a chill that must be magical in nature.",
      properties: [
        PROPERTIES.CHILL_ATTACK,
      ]
    });
  }
}

module.exports = WildBellowsEnemy;