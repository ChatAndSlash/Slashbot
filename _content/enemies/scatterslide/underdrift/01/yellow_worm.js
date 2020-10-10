"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class YellowWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-01-yellow_worm',
      displayName: 'Yellow Worm',
      description: 'Yellow is a colour of warning, which you\'d best heed before charging in blindly against this worm.  Like its siblings, it has a giant jaw full of teeth and a whiplike tail, but it is also covered in jaggy spikes that make it difficult to approach.',
    });
  }
}

module.exports = YellowWorm;