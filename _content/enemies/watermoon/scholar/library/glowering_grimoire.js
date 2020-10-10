"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsClues           = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class GloweringGrimoireEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsClues(80, 2, 4),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-glowering_grimoire',
      displayName: 'Glowering Grimoire',
      description: "This heavy book slowly thumps along the floor towards you, but its slow speed is deliberate, not a limitation, as when it gets in range of attack, it is capable of moving quite fast and using its weight to tremendous advantage.",
    });
  }
}

module.exports = GloweringGrimoireEnemy;