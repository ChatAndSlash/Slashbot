"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Hawk extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-01-hawk',
      displayName: 'Hawk',
      description: 'Screeching from the sky above, a hawk dives at your head, talons raking out towards you.',
    });
  }
}

module.exports = Hawk;