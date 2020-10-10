"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const ChillAction         = require('@mixins/enemy/actions/chill').ChillAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

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

class BlackpoolScholarEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(10),
  CastCindersAction,
  CastIcicleAction,
  BlindAction(20),
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-blackpool_scholar',
      displayName: 'Blackpool Scholar',
      description: "This tall, grey-skinned woman is wearing a long black coat with a stylized crimson \"P\" insignia, and is holding a large black spellbook.",
    });
  }
}

module.exports = BlackpoolScholarEnemy;