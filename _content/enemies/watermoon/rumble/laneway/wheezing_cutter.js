"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DoNothingAction     = require('@mixins/enemy/actions/do_nothing').DoNothingAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const DoNothing = DoNothingAction(30, {
  text: "%s is too tired to attack.",
});

class WheezingCutterEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DoNothing,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-wheezing_cutter',
      displayName: "Wheezing Cutter",
      description: "This old man holds a strikingly sharp blade, though he looks like he may drop it at any moment.  His breath comes in wheezing gasps, and each one looks like it may be his last.",
    });
  }
}

module.exports = WheezingCutterEnemy;