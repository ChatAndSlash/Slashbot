"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SatyrEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CurseAction(20),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-satyr',
      displayName: 'Satyr',
      description: "Part human, part goat, all mischief and malice.  He yells as he attacks you, and although you cannot understand the language, you can tell his intent - he wants you dead.",
    });
  }
}

module.exports = SatyrEnemy;