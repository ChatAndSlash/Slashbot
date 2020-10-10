"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DoNothingAction     = require('@mixins/enemy/actions/do_nothing').DoNothingAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const DoNothing = DoNothingAction(20, {
  text: "%s are too tired to attack.",
});

class LethargicLightweightsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DoNothing,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-lethargic_lightweights',
      displayName: "Lethargic Lightweights",
      description: "Definitely not in their fighting prime, this group of fighters can’t be bothered to put in the time training and putting on the muscle that might have been useful in this fight.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = LethargicLightweightsEnemy;