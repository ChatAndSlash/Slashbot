"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SewnUpAbominationEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-sewn_up_abomination',
      displayName: 'Sewn-up Abomination',
      description: "This zombie looks like a practice cadaver for someone learning how to sew up terrible, terrible wounds.  It is covered in stiches and is sewn closed in many places where it shouldn't be.",
    });
  }
}

module.exports = SewnUpAbominationEnemy;