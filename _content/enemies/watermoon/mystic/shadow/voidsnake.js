"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConstrictAction     = require('@mixins/enemy/actions/constrict').ConstrictAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class VoidSnakeEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConstrictAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-shadow-voidsnake',
      displayName: 'Voidsnake',
      description: "Moving through the mists on the ground is a snake seemingly made of nothing at all.  Unfortunately for you, it is definitely solid, and its attacks are absolutely dangerous.",
    });
  }
}

module.exports = VoidSnakeEnemy;