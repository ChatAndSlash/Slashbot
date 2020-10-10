"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const AcidSplashAction    = require('@mixins/enemy/actions/acid_splash').AcidSplashAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const BreatheFlameAction = BurnAction(10, {
  dodgeText: ":dash: %s breathes flame at you but you dodge!",
  missText: "%s breathes flame at you but misses!",
  attackText: ":fire: %s breathes flame at you, dealing %s damage and burning you.%s"
});

class ChimeraEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(10),
  BerserkAction(20),
  AcidSplashAction(10),
  BreatheFlameAction,
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-chimera',
      displayName: 'Chimera',
      description: "This monstrous beast has the head of a lion, the body of a massive goat, and its tail is the head of an acid-spitting snake.  Oh, and it breathes fire, too.  Doesn't seem fair.",
    });
  }
}

module.exports = ChimeraEnemy;