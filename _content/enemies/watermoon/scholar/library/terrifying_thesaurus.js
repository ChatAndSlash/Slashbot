"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsClues           = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class TerrifyingThesaurusEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsClues(95, 3, 4),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-terrifying_thesaurus',
      displayName: 'Terrifying Thesaurus',
      description: "Every word in this thesaurus contains a variety of synonyms you had never been aware of before, and causes you to worry that you've been giving unintentional offense your entire life.  Well, you wonder briefly, as you are forced to immediately defend yourself from this same book.",
    });
  }
}

module.exports = TerrifyingThesaurusEnemy;