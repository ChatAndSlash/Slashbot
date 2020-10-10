"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction        = require('@mixins/enemy/actions/daze').DazeAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class EnormousCentipede extends mix(ScatterslideEnemy).with(
  FuriousAction(25),
  DazeAction(20),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-02-enormous_centipede',
      displayName: 'Enormous Centipede',
      description: 'This centipede is as large and as vicious as a large, vicious dog.  Its many legs are individually capable of inflicting serious damage, so Phaera help you if you get close to more than a few at once.',
    });
  }
}

module.exports = EnormousCentipede;