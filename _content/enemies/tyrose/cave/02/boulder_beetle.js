"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class BoulderBeetle extends mix(Enemy).with(
  FuriousAction(40),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-02-boulder_beetle',
      displayName: 'Boulder Beetle',
      description: 'At first you take this for any other rock on the floor, but as you pass by, chitinous legs spring out from underneath, and a set of sharp-looking mandibles unfold.',
    });
  }
}

module.exports = BoulderBeetle;