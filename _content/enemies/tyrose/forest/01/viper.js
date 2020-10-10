"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction     = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Viper extends mix(Enemy).with(
  FuriousAction(20),
  PoisonAction(10, { strength: 25 }),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-01-viper',
      displayName: 'Viper',
      description: 'This mottled brown and beige snake is curled in on itself, hissing occasionally and flicking its tongue at you, tasting the air in an attempt to gauge your intentions. You can\'t help but feel a bit queasy when catching sight of its fangs, clearly dripping with venom.',
    });
  }
}

module.exports = Viper;