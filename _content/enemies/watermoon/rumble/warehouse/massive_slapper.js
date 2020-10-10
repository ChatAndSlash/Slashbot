"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const MultiAttackAction   = require('@mixins/enemy/actions/multi_attack').MultiAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const Headbutt = PowerAttackAction(20, {
  multiplier: 2,
  text: "%s dives at you with a power headbutt for %s damage!%s"
});

const ThousandHandSlap = MultiAttackAction(20, {
  minAttacks: 8,
  maxAttacks: 10,
  multiplier: 0.25,
  preText: ":triumph: %s prepares a flurry of slaps!",
  attackText: ":frowning: %s slaps you for %s damage, his hands a blur.%s",
});

class MassiveSlapperEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  Headbutt,
  ThousandHandSlap,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-massive_slapper',
      displayName: "Massive Slapper",
      description: "This massive wrestler crouches before you, his bulk as much fat as it is muscle. Disconcertingly, he wears only a loose cloth around his waist, though he has his hair tied back in a topknot.  He laughs as you approach, eager for the fight.",
    });
  }
}

module.exports = MassiveSlapperEnemy;