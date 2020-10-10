"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class Wolverine extends mix(Enemy).with(
  FuriousAction(20),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-02-wolverine',
      displayName: 'Wolverine',
      description: 'A wolverine looks as if someone had taken a small bear and gave it a ferret\'s head, which would be cute if they didn\'t also give it a mouthful of razor sharp teeth and a bad attitude, which is what you have in front of you.',
    });
  }
}

module.exports = Wolverine;