"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Salamander extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-01-salamander',
      displayName: 'Salamander',
      description: 'This small lizard would be entirely unthreatening were it not for the blazing tail it whips around as it charges at you. It doesn\'t provide much light, but it sure is hot!',
    });
  }
}

module.exports = Salamander;