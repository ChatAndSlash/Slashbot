"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

const PROPERTIES = require('@constants').PROPERTIES;

class BatSwarm extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-01-bat_swarm',
      displayName: 'Bat Swarm',
      description: 'Oh god, AUGH, oh god! They\'re everywhere, in your hair, stuck to your clothes, there\'s one hanging on to your ear, quick quick get them off!',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = BatSwarm;