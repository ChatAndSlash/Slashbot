"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsClues           = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class DemonicDictionaryEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsClues(70, 2, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-demonic_dictionary',
      displayName: 'Demonic Dictionary',
      description: "By its cover, a very intimidating book, it turns out this is simply a Common-to-Demonic dictionary.  Nothing special.",
    });
  }
}

module.exports = DemonicDictionaryEnemy;