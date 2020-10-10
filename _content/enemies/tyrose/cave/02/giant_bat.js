"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class GiantBat extends mix(Enemy).with(
  FuriousAction(40),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-02-giant_bat',
      displayName: 'Giant Bat',
      description: 'Holy heck! This thing is the size of a small dog and it still flies somehow! Be careful when it dives at you!',
    });
  }
}

module.exports = GiantBat;