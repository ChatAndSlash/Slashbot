"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SilentHunterEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-silent_hunter',
      displayName: 'Silent Hunter',
      description: "You stumble over a loose stone, and lucky that you do, as you end up ducking under a blow aimed for your head!  You get your footing quickly and turn to face your attacker, a shadowy being that makes no noise whatsoever.",
    });
  }
}

module.exports = SilentHunterEnemy;