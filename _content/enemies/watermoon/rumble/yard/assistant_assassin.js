"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PowerAttack = PowerAttackAction(20, {
  multiplier: 2,
  text: "%s tosses a smoke bomb at the ground, then appears directly behind you, stabbing you for %s damage!%s"
});

class AssistantAssassinEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  PowerAttack,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-assistant_assassin',
      displayName: "Assistant Assassin",
      description: "Loaded down with all kinds of break-and-enter and assassination tools, this man seems like he _kind of_ knows his stuff.",
    });
  }
}

module.exports = AssistantAssassinEnemy;