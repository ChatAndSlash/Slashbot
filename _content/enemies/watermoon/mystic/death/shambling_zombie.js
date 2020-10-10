"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ShamblingZombieEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-shambling_zombie',
      displayName: 'Shambling Zombie',
      description: "Though slow moving, this zombie is exceptionally tough.  That, combined with the fact that it is digusting and you absolutely do not want to touch it, makes it a very difficult enemy to defeat.",
    });
  }
}

module.exports = ShamblingZombieEnemy;