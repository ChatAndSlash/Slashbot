"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const PowerAttack = PowerAttackAction(20, {
  multiplier: 2,
  text: "%s patiently lines up her shot and strikes you in a gap in your armour for %s damage!%s"
});

class AccomplishedMarkswomenEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DazeAction(20),
  PowerAttack,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-accomplished_markswomen',
      displayName: "Accomplished Markswomen",
      description: "This group of ladies all wear broad-brimmed hats and have both long and short guns at the ready.  They take their time, line up their shots, and rarely, if ever, miss.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
        PROPERTIES.RANGED_ATTACK,
      ]
    });
  }
}

module.exports = AccomplishedMarkswomenEnemy;