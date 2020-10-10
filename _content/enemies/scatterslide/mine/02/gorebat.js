"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class Gorebat extends mix(ScatterslideEnemy).with(
  FuriousAction(25),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-02-gorebat',
      displayName: 'Gorebat',
      description: 'Larger than a Bloodbat, and equipped with sharp claws and a mouthful of jagged, crammed-together teeth, the Gorebat doesn\'t feed on blood so much as any chunks of fresh flesh it can find or make.',
    });
  }
}

module.exports = Gorebat;