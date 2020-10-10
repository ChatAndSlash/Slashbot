"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class ScarletWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(30),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-03-scarlet_worm',
      displayName: 'Scarlet Worm',
      description: 'Not to be fooled, you approach this scarlet-coloured worm carefully.  Good thing, too, as in addition to the terrifying maw of the Purple Worm, it has a short, whiplike tail as well.',
    });
  }
}

module.exports = ScarletWorm;