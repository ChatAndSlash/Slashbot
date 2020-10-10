"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class BrownWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(35),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-04-brown_worm',
      displayName: 'Brown Worm',
      description: 'Half the size of any of the other coloured worms, and utterly devoid of any visible natural weaponry, you\'d be tempted to let your guard down against this worm.  You\'d be wrong, though, and you\'d find out when it shot a salvo of spikes at you from seemingly nowhere, and fired at a blistering speed.',
    });
  }
}

module.exports = BrownWorm;