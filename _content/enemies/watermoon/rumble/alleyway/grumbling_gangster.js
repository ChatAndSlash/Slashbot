"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class GrumblingGangsterEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-grumbling_gangster',
      displayName: "Grumbling Gangster",
      description: "Doffing his battered fedora whilst muttering under his breath, this grumpy guy steps menacingly towards you.",
    });
  }
}

module.exports = GrumblingGangsterEnemy;