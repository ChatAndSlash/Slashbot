"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction        = require('@mixins/enemy/actions/daze').DazeAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class GiantCentipede extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DazeAction(10),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-01-giant_centipede',
      displayName: 'Giant Centipede',
      description: 'You know what a centipede is and what size it should be.  This one is the size of a medium dog, and somehow has also increased in speed and strength as well.',
    });
  }
}

module.exports = GiantCentipede;