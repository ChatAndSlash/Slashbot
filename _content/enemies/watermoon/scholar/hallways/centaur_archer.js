"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FlamingArrowAction = BurnAction(25, {
  dodgeText: ":dash: %s shoots a flaming arrow at you but you dodge!",
  missText: "%s shoots a flaming arrow at you but misses!",
  attackText: ":fire: %s shoots you with a flaming arrow, dealing %s damage and burning you.%s"
});

class CentaurArcherEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  FlamingArrowAction,
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-centaur_archer',
      displayName: 'Centaur Archer',
      description: "A flaming arrow cutting across your vision is the first notice you have that you're under attack.  A broad-shouldered, well-muscled Centaur steps into view, another flaming arrow nocked and at the ready.",
    });
  }
}

module.exports = CentaurArcherEnemy;