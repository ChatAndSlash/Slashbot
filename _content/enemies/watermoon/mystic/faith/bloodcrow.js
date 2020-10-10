"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BloodcrowEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-bloodcrow',
      displayName: 'Bloodcrow',
      description: "A few spatters of blood drip onto you from above, mere moments before a crow soaked in blood swoops down from above!  You wonder briefly how it can fly when coated in so much extra weight, before you determine it is in fact composed entirely of blood.  You'd be disgusted, but you're fighting for your life.",
    });
  }
}

module.exports = BloodcrowEnemy;