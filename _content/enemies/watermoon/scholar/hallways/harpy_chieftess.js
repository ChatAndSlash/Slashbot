"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction        = require('@mixins/enemy/actions/concuss').ConcussAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DefendAction         = require('@mixins/enemy/actions/defend').DefendAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class HarpyChieftessEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(10),
  ConcussAction(20),
  RecklessAttackAction(10),
  DefendAction(10),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-harpy_chieftess',
      displayName: 'Harpy Chieftess',
      description: "Standing proud in shining scale armour, a chieftess of the harpy clans stands before you.  Before you can admire her fine equipment too much, she charges in!",
    });
  }
}

module.exports = HarpyChieftessEnemy;