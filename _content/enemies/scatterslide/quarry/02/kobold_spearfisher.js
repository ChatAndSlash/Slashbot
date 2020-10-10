"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class KoboldSpearfisher extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-02-kobold_spearfisher',
      displayName: 'Kobold Spearfisher',
      description: 'Standing nearly perfectly still and holding his spear with a relaxed menace, you get the feeling this Kobold has spent time fishing for more than just fish.',
    });
  }
}

module.exports = KoboldSpearfisher;