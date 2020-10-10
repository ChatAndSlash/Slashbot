"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const CastCindersAction = BurnAction(10, {
  dodgeText: ":dash: %s casts Cinders at you but you dodge!",
  missText: "%s casts Cinders at you but misses!",
  attackText: ":fire: %s casts Cinders at you, dealing %s damage and burning you.%s"
});

class BlackpoolGuardianEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(30),
  BlindAction(10),
  CastCindersAction,
  DropsMoondrop(100, 2),
  WatermoonReputation(10)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-blackpool_guardian',
      displayName: 'Blackpool Guardian',
      description: "This tiny woman is wearing a full-body, form-fitting black uniform with the stylized crimson \"P\" of the Blackpool, yet sports no weapons.  Not knowing the danger she poses, you approach warily.  As you draw into range, she strikes a defensive pose, and her fists in front of her burst into flame!",
      isBoss: true,
      stats: {
        base: {
          maxHp: 75,
          force: 7,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 35,
          force: 2,
          goldMin: 20,
          goldMax: 25
        }
      },
      attackProperties: [
        PROPERTIES.IS_ATTACK,
        PROPERTIES.BURN_ATTACK,
      ]
    });
  }
}

module.exports = BlackpoolGuardianEnemy;