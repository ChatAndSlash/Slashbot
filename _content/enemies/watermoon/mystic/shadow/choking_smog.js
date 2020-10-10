"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ChokingSmogEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-choking_smog',
      displayName: 'Choking Smog',
      description: "What looks like a smoky bull charges you and nearly bowls you over.  As it passes, tendrils of smog raise off its back and envelop your head, causing you to choke and cough.",
    });
  }
}

module.exports = ChokingSmogEnemy;