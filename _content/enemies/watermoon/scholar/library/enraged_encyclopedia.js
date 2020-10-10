"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsClues           = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class EnragedEncyclopediaEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsClues(75, 2, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-enraged_encyclopedia',
      displayName: 'Enraged Encyclopedia',
      description: "A swarm of furious books descend on you from above!  You only just manage to get volume #4 (Fulimation to Geodes) out of your face when volume #9 (Necrology to Nyxie) dive-bombs you!  Stay on your toes!",
      properties: [
        PROPERTIES.IS_GROUP,
      ],
    });
  }
}

module.exports = EnragedEncyclopediaEnemy;