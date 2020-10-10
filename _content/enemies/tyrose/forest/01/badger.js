"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Badger extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-01-badger',
      displayName: 'Badger',
      description: 'You are facing an angry, hissing Badger. It is short, fat, and furious, with stubby legs and a long black-and-white marked head that is currently trying to bite your ankles.',
    });
  }
}

module.exports = Badger;