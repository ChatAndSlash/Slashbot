"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class BlackWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(35),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-05-black_worm',
      displayName: 'Black Worm',
      description: "Small, fast, and *furious*, this tiny black worm zips around the room, taking painful bites out of you as it passes.",
      stats: {
        base: {
          maxHp: 30,
          dodge: 20,
        },
        perLevel: {
          maxHp: 10,
        }
      },
    });
  }
}

module.exports = BlackWorm;