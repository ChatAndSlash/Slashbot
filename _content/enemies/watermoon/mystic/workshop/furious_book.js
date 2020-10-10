"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction           = require('@mixins/enemy/actions/burn').BurnAction;
const ChillAction          = require('@mixins/enemy/actions/chill').ChillAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const CastCindersAction = BurnAction(10, {
  dodgeText: ":dash: %s casts Cinders at you but you dodge!",
  missText: "%s casts Cinders at you but misses!",
  attackText: ":fire: %s casts Cinders at you, dealing %s damage and burning you.%s"
});

const CastIcicleAction = ChillAction(10, {
  dodgeText: ":dash: %s casts Icicle at you but you dodge!",
  missText: "%s casts Icicle at you but misses!",
  attackText: ":snowflake: %s casts Icicle at you, dealing %s damage and chilling you.%s"
});

class FuriousBookEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(40),
  CastCindersAction,
  CastIcicleAction,
  DropsEssenceCrystals(20, 1, 2),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-furious_book',
      displayName: 'Furious Book',
      description: "As you walk past a bookshelf, a book falls to the floor.  You stand there, wondering if you'd nudged the bookshelf or what, when the book leaps at you, sharp-looking paper fangs flashing!",
    });
  }
}

module.exports = FuriousBookEnemy;