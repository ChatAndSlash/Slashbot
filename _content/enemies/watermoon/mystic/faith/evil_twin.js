"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const ChillAction         = require('@mixins/enemy/actions/chill').ChillAction;
const HealAction          = require('@mixins/enemy/actions/heal').HealAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const CastCindersAction = BurnAction(100, {
  dodgeText: ":dash: %s casts Cinders at you but you dodge!",
  missText: "%s casts Cinders at you but misses!",
  attackText: ":fire: %s casts Cinders at you, dealing %s damage and burning you.%s"
});

const CastIcicleAction = ChillAction(10, {
  dodgeText: ":dash: %s casts Icicle at you but you dodge!",
  missText: "%s casts Icicle at you but misses!",
  attackText: ":snowflake: %s casts Icicle at you, dealing %s damage and chilling you.%s"
});

const CastCureAction = HealAction(10, {
  strength: 0.33,
  text: "%s gathers magical energy and casts Cure, healing themselves of %d damage."
});

class EvilTwinEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CastCindersAction,
  CastIcicleAction,
  CastCureAction,
  CurseAction(10),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-evil_twin',
      displayName: 'Evil Twin',
      description: "You trip over a root in the ground you didn't see, and place your hand in a sticky substance that suddenly emits a glaring heat.  As you pull your hand away, the sludge begins to grow and take form, quickly becoming an almost exact duplicate of you!",
    });
  }
}

module.exports = EvilTwinEnemy;