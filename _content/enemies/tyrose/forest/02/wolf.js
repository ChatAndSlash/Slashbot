"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Wolf extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-02-wolf',
      displayName: 'Wolf',
      description: 'The low growl you hear from the silver wolf in front of you is unsettling, to say the least. The fangs said wolf have bared in your direction are downright upsetting. The dead, yellow eyes it has trained on you are terrifying.',
    });
  }
}

module.exports = Wolf;