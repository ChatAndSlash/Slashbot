"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class FanaticalCultistEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CurseAction(15),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-fanatical_cultist',
      displayName: 'Fanatical Cultist',
      description: "\"Prepare to submit yourself to His Great and Many Tentacles!\" you hear, as this cultist launches himself at you, fear and anger alight in his eyes.",
    });
  }
}

module.exports = FanaticalCultistEnemy;