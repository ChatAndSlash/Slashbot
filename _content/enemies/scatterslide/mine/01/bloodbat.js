"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class Bloodbat extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(6)
) {
  constructor() {
    super({
      type: 'scatterslide-mine-01-bloodbat',
      displayName: 'Bloodbat',
      description: 'Swooping down from the ceiling is a mass of leathery wings and bristly fur.  The common bat, this ain\'t.  Bloodbats are so-named because they feed off of blood, and they aren\'t picky about the source.',
    });
  }
}

module.exports = Bloodbat;