"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class GryphonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(40),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-gryphon',
      displayName: 'Gryphon',
      description: "Though not as large as you'd expect, this half-eagle, half-lion monster is perfectly suited to roam the halls of the labyrinth, deterring wanders with its sheer ferocity.  Well, and claws.  And beak.",
    });
  }
}

module.exports = GryphonEnemy;