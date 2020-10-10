"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ContentiousKnaveEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  ConcussAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-back_lot-contentious_knave',
      displayName: "Contentious Knave",
      description: "You try to explain to this young lad that you’re just passing through and that there’s no reason to fight, but he’s having none of it.  \"This is our territory, it’s clearly marked, and you’re clearly spoiling for a fight,\" he says, among other things.  Even though the fight is well and truly joined, he won’t stop arguing with you.",
    });
  }
}

module.exports = ContentiousKnaveEnemy;