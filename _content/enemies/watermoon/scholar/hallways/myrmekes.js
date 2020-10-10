"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class MyrmekesEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-myrmekes',
      displayName: 'Myrmekes',
      description: "While you could describe this as \"merely a horde of ants\", you would be remiss if you didn't also mention that each ant was the size of a small dog, making this swarm quite deadly indeed.",
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = MyrmekesEnemy;