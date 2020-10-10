"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class CrimsonWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(30),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-04-crimson_worm',
      displayName: 'Crimson Worm',
      description: "This worm's jaw is definitely smaller than the other worms you've run into, which is only a relief until you realize that it has three long tails, each capable of attacking separately.",
    });
  }
}

module.exports = CrimsonWorm;