"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PowerAttack = PowerAttackAction(20, {
  multiplier: 2,
  text: "%s whales on you with a metal sap for %s damage!%s"
});

class AggressiveRobberEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  PowerAttack,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-back_lot-aggressive_robber',
      displayName: "Aggressive Robber",
      description: "While you’re fairly certain that when someone uses force to rob you, they’re called you a mugger, this tall, broad lady isn’t really giving you the time required to have such a debate, as she presses the attack against you.",
    });
  }
}

module.exports = AggressiveRobberEnemy;