"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

const PROPERTIES = require('@constants').PROPERTIES;

class SpiderHorde extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(10)
) {
  constructor() {
    super({
      type: 'scatterslide-underdrift-01-spider_horde',
      displayName: 'Spider Horde',
      description: 'You thought you\'d seen a lot of spiders *before*.  These spiders are larger, with easily-visible mandibles, and there are *scores* of them.',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = SpiderHorde;