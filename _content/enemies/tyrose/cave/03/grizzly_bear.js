"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction       = require('@mixins/enemy/actions/daze').DazeAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class GrizzlyBear extends mix(Enemy).with(
  FuriousAction(35),
  DazeAction(15),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-03-grizzly_bear',
      displayName: 'Grizzly Bear',
      description: 'All fur, muscle, tooth, and claw, this bear means business.',
    });
  }
}

module.exports = GrizzlyBear;