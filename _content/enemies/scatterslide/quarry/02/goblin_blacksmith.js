"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class GoblinBlacksmith extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-02-goblin_blacksmith',
      displayName: 'Goblin Blacksmith',
      description: 'With burly arms black from the smithy and a giant hammer swung nonchalantly over his shoulder, this Goblin is a force to be reckoned with.',
    });
  }
}

module.exports = GoblinBlacksmith;