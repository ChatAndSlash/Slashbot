"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DefendAction        = require('@mixins/enemy/actions/defend').DefendAction;
const DropsClues          = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class AgonizingAutobiographyEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DefendAction(40),
  DropsClues(55, 1, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-agonizing_autobiography',
      displayName: 'Agonizing Autobiography',
      description: "Written by a much-maligned mage, Archius Malenthus, this book was an attempt to assuage the anger of a public perterbed by his \"perversions of magic\".  Now animated, it has taken on its text's over-defensive tone and nature.",
    });
  }
}

module.exports = AgonizingAutobiographyEnemy;