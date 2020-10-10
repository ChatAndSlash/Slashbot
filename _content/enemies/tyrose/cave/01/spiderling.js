"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction     = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Spiderling extends mix(Enemy).with(
  FuriousAction(20),
  PoisonAction(10),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-01-spiderling',
      displayName: 'Spiderling',
      description: 'This fanged, fuzzy, eight-legged monster looks like someone crossed a large spider with an angry weasel. Venom drips menacingly from its long, sharp fangs.',
    });
  }
}

module.exports = Spiderling;