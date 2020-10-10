"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class CorpseballEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-corpseball',
      displayName: 'Corpseball',
      description: "Probably also the official sport of this plane, a corpseball is a giant pile of corpses sewn together in a ball that can roll itself around under its own power.  The one attempting to run you down right now is a prime example.  You wonder -- briefly, and as you dodge aside at the last second -- if this is where Skeleton Balls come from, or if they have separate yet similar origins.",
    });
  }
}

module.exports = CorpseballEnemy;