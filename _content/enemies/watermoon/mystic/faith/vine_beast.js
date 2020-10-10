"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConstrictAction     = require('@mixins/enemy/actions/constrict').ConstrictAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class VineBeastEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConstrictAction(25),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-vine_beast',
      displayName: 'Vine Beast',
      description: "You push past some vines draped over a tree branch, and they seem to twitch at your touch.  You turn to face them, puzzled, when they attack, whipping all around you!",
    });
  }
}

module.exports = VineBeastEnemy;