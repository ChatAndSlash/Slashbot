"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

class TerritorialElk extends mix(Enemy).with(
  FuriousAction(40),
  DropsCrystalAcid(5)
) {
  constructor() {
    super({
      type: 'tyrose-forest-03-territorial_elk',
      displayName: 'Territorial Elk',
      description: 'Though herbivores, elks are huge, and this one is upset that you\'ve wandered into its territory, which makes it huge and _angry_, too.',
    });
  }
}

module.exports = TerritorialElk;