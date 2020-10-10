"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction        = require('@mixins/enemy/actions/concuss').ConcussAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class HarpyMistressEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-harpy_mistress',
      displayName: 'Harpy Mistress',
      description: "It's hard to tear your eyes away from the crazed leer on this winged warrior's face, but you force yourself to watch her weapon, a huge wooden cudgel that she swings much easier than it looks like she has any right to.",
    });
  }
}

module.exports = HarpyMistressEnemy;