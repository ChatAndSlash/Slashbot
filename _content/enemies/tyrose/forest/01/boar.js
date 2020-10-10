"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Boar extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-01-boar',
      displayName: 'Boar',
      description: 'A grunting boar paces back and forth in front of you. Whenever you move, it snarls and snaps at you, trying to get a good angle to gore you with its sharp tusks.',
    });
  }
}

module.exports = Boar;