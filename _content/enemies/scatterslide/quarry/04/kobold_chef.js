"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class KoboldChef extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-04-kobold_chef',
      displayName: 'Kobold Chef',
      description: "This Kobold carries a brace of sharp-ish knives and has a variety of fresh-ish meat strapped to his belt.  You're not sure if you can really call him a chef if none of his food is actually cooked, but honestly, that's the least of your problems right now.",
    });
  }
}

module.exports = KoboldChef;