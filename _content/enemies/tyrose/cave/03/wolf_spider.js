"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction     = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class WolfSpider extends mix(Enemy).with(
  FuriousAction(50),
  PoisonAction(25),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-03-wolf_spider',
      displayName: 'Wolf Spider',
      description: 'Cross a wolf and a spider and you get... this. This horror has eight long furry legs, a segmented body, and what looks like a flat, wide version of a wolf\'s face.',
    });
  }
}

module.exports = WolfSpider;