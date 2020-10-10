"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class CaveWolf extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-01-cave_wolf',
      displayName: 'Cave Wolf',
      description: 'This wolf is darker in colour than other wolves you\'ve seen, and less cautious about approaching and causing grievous bodily harm to people.',
    });
  }
}

module.exports = CaveWolf;