"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class KoboldRatcatcher extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-01-kobold_ratcatcher',
      displayName: 'Kobold Ratcatcher',
      description: 'A brace of live rats is tied to this kobold\'s belt, squeaking wildly in pain and fear.  The kobold looks at you with a terrified expression, worried that he\'s been caught just as surely as his rats.',
    });
  }
}

module.exports = KoboldRatcatcher;