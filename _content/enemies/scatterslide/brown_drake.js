"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class BrownDrake extends mix(ScatterslideEnemy).with(
  FuriousAction(50),
  DropsQuicksalt(25, 1, 2)
) {
  constructor() {
    super({
      type: 'scatterslide-brown_drake',
      displayName: 'Brown Drake',
      description: 'Where green drakes still had massive wings and were capable of flight, brown drakes have tiny, useless wings.  Rather than be hampered by this fact, their reduced size allows them to slither around at high speed and pass unobstructed through the myriad holes and tunnels that permeate this cavern.',
      levelBonus: 1,
      stats: {
        base: {
          maxHp: 75,
          defence: 5,
        },
        perLevel: {
          force: 1,
          defence: 1.5,
        }
      },
    });
  }
}

module.exports = BrownDrake;