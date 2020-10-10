"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class AspiringVillainEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  BlindAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-aspiring_villain',
      displayName: "Aspiring Villain",
      description: "Dressed in a home-made cape and costume, you’re forced to listen to half a monologue before engaging with this not-yet-ready-for-prime-time villain, as she hasn’t yet figured out the other half.",
    });
  }
}

module.exports = AspiringVillainEnemy;