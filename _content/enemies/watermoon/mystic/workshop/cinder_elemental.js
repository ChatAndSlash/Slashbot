"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction           = require('@mixins/enemy/actions/burn').BurnAction;
const DropsEssenceCrystals = require('@mixins/enemy/loot/essence_crystal').DropsEssenceCrystals;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const SpitFireAction = BurnAction(30, {
  isRanged: true,
  dodgeText: ":dash: %s spits fire at you but you dodge!",
  missText: "%s spits fire at you but misses!",
  attackText: ":fire: %s spits fire at you, dealing %s damage.%s"
});

class CinderElementalEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  SpitFireAction,
  DropsEssenceCrystals(30, 2, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-workshop-cinder_elemental',
      displayName: 'Cinder Elemental',
      description: "A tiny cinder jumps out of a fire, lands on a piece of broken wood, and near-instantaneously grows to about the size of your head.  It grows much hotter too, and spits a few glowing sparks your way.",
    });
  }
}

module.exports = CinderElementalEnemy;