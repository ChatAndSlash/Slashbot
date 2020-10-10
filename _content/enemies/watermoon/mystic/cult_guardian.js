"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FlailAction = DazeAction(20, {
  dodgeText: ":dash: %s flails at you with its tentacles, but you dodge!",
  missText: "%s flails at you with its tentacles, but misses!",
  attackText: ":wavy_dash: %s flails at you with its tentacles, dealing %s damage %s dazing you for %d turns.%s"
});

class CultGuardianEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(100, 1),
  CurseAction(10),
  FlailAction,
  WatermoonReputation(10)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-cult_guardian',
      displayName: 'Cult Guardian',
      description: "At first, the tall, dark-haired man that you face seems unimpressive, but when he unbuttons his long coat and it turns out that his entire lower half is comprised of awful black tentacles, your opinion quickly changes.",
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
    });
  }
}

module.exports = CultGuardianEnemy;