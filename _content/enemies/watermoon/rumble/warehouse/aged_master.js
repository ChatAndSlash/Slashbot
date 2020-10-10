"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const MultiAttackAction   = require('@mixins/enemy/actions/multi_attack').MultiAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const SnakeRoll = StunAction(20, {
  dodgeText: "%s rolls forward and stabs at you with a pointed hand, but you dodge!",
  missText: "%s rolls forward and stabs at you with a pointed hand, but misses!",
  attackText: "%s rolls forward and stabs at you with a pointed hand, dealing %s damage and stunning you for %d turns!%s",
});

const ChainedHooks = MultiAttackAction(20, {
  minAttacks: 2,
  maxAttacks: 5,
  preText: ":triumph: %s winds up to deliver a series of chained hooks!",
  attackText: ":frowning: %s lands a hook directly into your side, dealing %s damage.%s",
});

class AgedMasterEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  SnakeRoll,
  ChainedHooks,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-aged_master',
      displayName: "Aged Master",
      description: "An old man, with long white hair and beard.  He wears a purple robe, belted at the waist, with loose pants of a darker purple.  He stands confidently, alternating between two stances as you approach.",
    });
  }
}

module.exports = AgedMasterEnemy;