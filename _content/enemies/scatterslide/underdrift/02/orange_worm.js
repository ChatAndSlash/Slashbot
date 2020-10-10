"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class OrangeWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(25),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-02-orange_worm',
      displayName: 'Orange Worm',
      description: 'This worm is slightly larger than the Yellow Worm from before, and when it opens its mouth, its jaw splits into three, and short, bladed protrusions extend and flail wildly.',
    });
  }
}

module.exports = OrangeWorm;