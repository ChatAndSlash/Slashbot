"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SorrowfulSpiritEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-sorrowful_spirit',
      displayName: 'Sorrowful Spirit',
      description: "The fact that this spirit feels great sorrow over its past actions doesn't change the fact that its current actions involve trying to separate your head from your body.  You're sure it will feel bad about that too, but it won't help you any by that point.",
    });
  }
}

module.exports = SorrowfulSpiritEnemy;