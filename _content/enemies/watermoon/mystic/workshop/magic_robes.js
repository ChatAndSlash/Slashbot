"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction           = require('@mixins/enemy/actions/burn').BurnAction;
const ChillAction          = require('@mixins/enemy/actions/chill').ChillAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const CastCindersAction = BurnAction(25, {
  dodgeText: ":dash: %s casts Cinders at you but you dodge!",
  missText: "%s casts Cinders at you but misses!",
  attackText: ":fire: %s casts Cinders at you, dealing %s damage and burning you.%s"
});

const CastIcicleAction = ChillAction(25, {
  dodgeText: ":dash: %s casts Icicle at you but you dodge!",
  missText: "%s casts Icicle at you but misses!",
  attackText: ":snowflake: %s casts Icicle at you, dealing %s damage and chilling you.%s"
});

class MagicRobesEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(10),
  CastCindersAction,
  CastIcicleAction,
  DropsEssenceCrystals(30, 2, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-magic_robes',
      displayName: 'Magic Robes',
      description: "At first you consider checking these robes to see just how they might look on you, but that's before they jump up and start trying to strangle you!",
    });
  }
}

module.exports = MagicRobesEnemy;