"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class CreepingOooze extends mix(Enemy).with(
  FuriousAction(40),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-02-creeping_ooze',
      displayName: 'Creeping Ooze',
      description: 'This sickly-looking pile of protoplasm oozes slowly in your direction, pseudopods flailing wildly at you.',
    });
  }
}

module.exports = CreepingOooze;