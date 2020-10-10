"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction        = require('@mixins/enemy/actions/daze').DazeAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class ColossalCentipede extends mix(ScatterslideEnemy).with(
  FuriousAction(30),
  DazeAction(30),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-03-colossal_centipede',
      displayName: 'Colossal Centipede',
      description: 'Imagine a centipede the size of a pony.  Well, actually, you don\'t need to, because now you\'ve seen exactly that.',
    });
  }
}

module.exports = ColossalCentipede;