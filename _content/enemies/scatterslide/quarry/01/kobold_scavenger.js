"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class KoboldScavenger extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-01-kobold_scavenger',
      displayName: 'Kobold Scavenger',
      description: 'Smaller than other kobolds, this brown-furred creature is draped in discarded clothing and cast-off cookware in place of armour.  Its long ears twitch in fear and anger as you approach.',
    });
  }
}

module.exports = KoboldScavenger;