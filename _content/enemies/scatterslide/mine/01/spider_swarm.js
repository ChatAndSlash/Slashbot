"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction      = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

const PROPERTIES = require('@constants').PROPERTIES;

class SpiderSwarm extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  PoisonAction(20),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-01-spider_swarm',
      displayName: 'Spider Swarm',
      description: 'Spiders don\'t make much noise, but a whole swarm of the tiny things certainly do.  It\'s kind of a pittery-pattery-skittery sort of noise, and it will certainly haunt your nightmares going forward.',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = SpiderSwarm;