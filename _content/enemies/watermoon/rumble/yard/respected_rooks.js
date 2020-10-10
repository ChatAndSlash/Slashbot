"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const FirebombAction = BurnAction(30, {
  isRanged: true,
  dodgeText: ":dash: %s lob firebombs at you but you dodge!",
  missText: "%s lob firebombs at you but misses!",
  attackText: ":fire: %s lob firebombs at you, dealing %s damage.%s"
});

class RespectedRooksEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DazeAction(20),
  FirebombAction,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-respected_rooks',
      displayName: "Respected Rooks",
      description: "You’re not certain how cheaters such as these grew to be such respected members of the community, but you’re certain it has something to do with the quality of the community in question.  Regardless, these rooks aren’t out to cheat you, but to fight you!",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = RespectedRooksEnemy;