"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class RedWorm extends mix(ScatterslideEnemy).with(
  FuriousAction(30),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-03-red_worm',
      displayName: 'Red Worm',
      description: 'In addition to all the other awful and dangerous protrusions its brethren have, the Red Worm has a half-dozen tentacles that extend from its body and reach and grasp for anything that happens to wander too close by.',
    });
  }
}

module.exports = RedWorm;