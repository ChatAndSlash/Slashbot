"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class PossessedGroundskeeperEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-possessed_groundskeeper',
      displayName: 'Possessed Groundskeeper',
      description: "If it weren't for the slow shambling gait, the low moan, the glowing red eyes, and the fact that he tried to kill you when you offered help, you might have mistaken this fellow for a helpless groundskeeper!",
    });
  }
}

module.exports = PossessedGroundskeeperEnemy;