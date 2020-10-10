"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class PurpleWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(25),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-02-purple_worm',
      displayName: 'Purple Worm',
      description: 'At first you take this to be a slightly darker Pink Worm, then its jaw *unhinges* and even longer teeth unfold than you imagined possible.',
    });
  }
}

module.exports = PurpleWorm;