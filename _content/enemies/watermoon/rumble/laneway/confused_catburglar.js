"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DoNothingAction     = require('@mixins/enemy/actions/do_nothing').DoNothingAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const DoNothing = DoNothingAction(10, {
  text: "%s is confused, and does nothing.",
});

class ConfusedCatburglarEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DoNothing,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-confused_catburglar',
      displayName: "Confused Catburglar",
      description: "Dressed in all black, with felt attached to her feet to muffle her footsteps, you’re not sure why this thief has chosen to pick a fight with you instead of stealthily breaking into houses as she is obviously dressed for.",
    });
  }
}

module.exports = ConfusedCatburglarEnemy;