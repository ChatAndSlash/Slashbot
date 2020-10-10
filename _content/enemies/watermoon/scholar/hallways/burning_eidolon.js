"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const CastCindersAction = BurnAction(30, {
  dodgeText: ":dash: %s casts Cinders at you but you dodge!",
  missText: "%s casts Cinders at you but misses!",
  attackText: ":fire: %s casts Cinders at you, dealing %s damage and burning you.%s"
});

class BurningEidolonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  CastCindersAction,
  DropsMoondrop(100, 1, 2),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-burning_eidolon',
      displayName: 'Burning Eidolon',
      description: "This silvery phantasm is covered in ghostly flames, and when it attacks, despite the fact that you cannot feel the heat, nearby paper and plants curl up and burn.",
    });
  }
}

module.exports = BurningEidolonEnemy;