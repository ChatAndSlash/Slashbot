"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const WildSwing = DazeAction(20, {
  duration: 3,
  cooldown: 4,
  dodgeText: ":dash: %s attack wildly but you dodge!",
  missText: "%s attack wildly but misses!",
  attackText: ":dizzy_face: %s attack wildly with their maces and hit you squarely in the head, dealing %s damage %s dazing you for %d turns.%s"
});

class PaintedMacemenEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  WildSwing,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-painted_macemen',
      displayName: "Painted Macemen",
      description: "A local gang that all wield wooden maces and wear striped uniforms, they all paint their faces in bright and contrasting colours.  Those members not immediately attacking you, circle around you, taunting and teasing.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = PaintedMacemenEnemy;