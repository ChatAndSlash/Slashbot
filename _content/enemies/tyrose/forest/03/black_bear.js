"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction       = require('@mixins/enemy/actions/daze').DazeAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class BlackBear extends mix(Enemy).with(
  FuriousAction(30),
  DazeAction(10),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-03-black_bear',
      displayName: 'Black Bear',
      description: 'Though slow and lumbering most of the time, black bears can move with a frightening quickness when attacking, which is what this one is doing... right now! Watch out!',
    });
  }
}

module.exports = BlackBear;