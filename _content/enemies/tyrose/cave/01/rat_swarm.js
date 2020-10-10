"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

const PROPERTIES = require('@constants').PROPERTIES;

class RatSwarm extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(10)
) {
  constructor() {
    super({
      type: 'tyrose-cave-01-rat_swarm',
      displayName: 'Rat Swarm',
      description: 'Huge, angry rats swarm around your feet, biting you and attempting to claw their way up your legs to get at your softer, less-protected parts.',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = RatSwarm;