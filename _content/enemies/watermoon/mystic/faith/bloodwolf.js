"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BloodwolfEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-bloodwolf',
      displayName: 'Bloodwolf',
      description: "What you at first take to be a wolf covered in a lot of blood turns out to be a wolf _composed entirely_ of blood.  Your attacks liberally splash the red stuff around like any other liquid, but the bloodwolf's attacks are somehow razor-sharp in return.",
    });
  }
}

module.exports = BloodwolfEnemy;