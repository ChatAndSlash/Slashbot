"use strict";

const mix               = require('mixwith').mix;
const ScatterslideEnemy = require('@app/content/enemies/scatterslide').ScatterslideEnemy;
const FuriousAction     = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsQuicksalt    = require('@mixins/enemy/loot/quicksalt').DropsQuicksalt;

class KoboldRatlord extends mix(ScatterslideEnemy).with(
  FuriousAction(20),
  DropsQuicksalt(3)
) {
  constructor() {
    super({
      type: 'scatterslide-quarry-03-kobold_ratlord',
      displayName: 'Kobold Ratlord',
      description: 'Preceded by a small army of trained rats, the Ratlord leads his trained rat army to victory!  Well, he hopes for victory anyway.  Okay, so he hasn\'t really won any fights yet, rats are just rats after all, but he keeps trying.  You gotta give him credit.',
    });
  }
}

module.exports = KoboldRatlord;