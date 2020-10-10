"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
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

class HarpyWitchEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(10),
  FlameJetAction,
  CastHoarfrostBladeAction,
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-harpy_witch',
      displayName: 'Harpy Witch',
      description: "Flames swirl around this harpy's hands, while her wings gust scythes of hoarfrost with every flap.",
    });
  }
}

module.exports = HarpyWitchEnemy;