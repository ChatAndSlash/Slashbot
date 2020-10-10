"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const Fireball = BurnAction(20, {
  isRanged: true,
  dodgeText: ":dash: %s shoots a ball of fire from his hands but you dodge!",
  missText: "%s shoots a ball of fire from his hands but misses!",
  attackText: ":fire: %s shoots a ball of fire from his hands, dealing %s damage.%s"
});

const DragonUppercut = PowerAttackAction(20, {
  multiplier: 2,
  text: "%s crouches down, then delivers an uppercut with the force of a dragon for %s damage!%s"
});

class DragonKarateAdeptEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  Fireball,
  DragonUppercut,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-dragon_karate_adept',
      displayName: "Dragon Karate Adept",
      description: "Though wearing an old white jacket with the arms torn off and a headband that appears to have seen many years or use, the man who approaches you has powerful, chiseled muscles, and an intense, focused look.  It's clear that his entire life is fighting, and everything else is less important.",
    });
  }
}

module.exports = DragonKarateAdeptEnemy;