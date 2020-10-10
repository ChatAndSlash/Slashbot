"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class GoblinPatroller extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-01-goblin_patroller',
      displayName: 'Goblin Patroller',
      description: 'This bored-looking, green-skinned goblin has obviously chased off his fair share of miners trying to retrieve their equipment, and expects you to be more of the same.  What a surprise he\'s in for...',
    });
  }
}

module.exports = GoblinPatroller;