"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class CorpseButcherEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-corpse_butcher',
      displayName: 'Corpse Butcher',
      description: "Your eyes are drawn to the massive cleaver this huge ghoul carries, fully half the size of the beast itself.  The blood that covers it is fresh, making you wonder exactly who it recently belonged to.",
    });
  }
}

module.exports = CorpseButcherEnemy;