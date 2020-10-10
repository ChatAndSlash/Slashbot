"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Owl extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-01-owl',
      displayName: 'Owl',
      description: 'Owls are supposed to be wise creatures, but you have to question the wisdom of this one in picking a fight with you.',
    });
  }
}

module.exports = Owl;