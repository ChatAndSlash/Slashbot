"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const MultiAttackAction   = require('@mixins/enemy/actions/multi_attack').MultiAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const OverheadKick = ConcussAction(20, {
  text: "%s leaps up into the sky and slams down on you with her heel, dealing %s damage and concussing you!%s",
});

const ThunderKicks = MultiAttackAction(30, {
  minAttacks: 4,
  maxAttacks: 7,
  multiplier: 0.5,
  preText: ":triumph: %s balances on her back leg and prepares a flurry of kicks!",
  attackText: ":frowning: %s kicks you in the side with a lightning-quick kick for %s damage.%s",
});

class KungFuCopEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  OverheadKick,
  ThunderKicks,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-kung_fu_cop',
      displayName: "Kung fu Cop",
      description: "A young lady dressed in an Watermoon officer’s uniform stands before you, hands held at her sides, balled into fists.  Her long hair is done up in buns on either side of her head, and her makeup has been applied to make her already severe expression more impressive.  She takes a step closer to you, and you are briefly impressed by her powerful legs, that is, until she starts kicking you with them.",
    });
  }
}

module.exports = KungFuCopEnemy;