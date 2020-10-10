"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Cougar extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-02-cougar',
      displayName: 'Cougar',
      description: 'This tawny cat has sharp claws, long teeth, and an unholy shrieking yowl. It paces towards you with malice in its eyes.',
    });
  }
}

module.exports = Cougar;