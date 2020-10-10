"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class PinkWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-01-pink_worm',
      displayName: 'Pink Worm',
      description: 'This long, many-segmented, pink-coloured worm is far more dangerous that it appears at first.  Inside its soft-looking mouth is several rows of razor-sharp teeth!',
    });
  }
}

module.exports = PinkWorm;