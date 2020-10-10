"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction         = require('@mixins/enemy/actions/burn').BurnAction;
const ChillAction         = require('@mixins/enemy/actions/chill').ChillAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FlameJetAction = BurnAction(20, {
  dodgeText: ":dash: %s casts Flame Jet at you but you dodge!",
  missText: "%s casts Flame Jet at you but misses!",
  attackText: ":fire: %s casts Flame Jet at you, dealing %s damage and burning you.%s"
});

const CastHoarfrostBladeAction = ChillAction(20, {
  dodgeText: ":dash: %s casts Hoarfrost Blade at you but you dodge!",
  missText: "%s casts Hoarfrost Blade at you but misses!",
  attackText: ":snowflake: %s casts Hoarfrost Blade at you, dealing %s damage and chilling you.%s"
});

class CentaurWarmageEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  FlameJetAction,
  CastHoarfrostBladeAction,
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-centaur_warmage',
      displayName: 'Centaur Warmage',
      description: "One of this centaur's hands are wreathed in flame, the other frost.  Clearly, she's mastered elemental war magic, and is not afraid to use it!",
    });
  }
}

module.exports = CentaurWarmageEnemy;