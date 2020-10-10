"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DrainLifeAction     = require('@mixins/enemy/actions/drain_life').DrainLifeAction;
const DropsClues          = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class TwistedTextbookEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DrainLifeAction(20),
  DropsClues(100, 3, 4),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-twisted_textbook',
      displayName: 'Twisted Textbook',
      description: "Though it purports to cover a range of benign and ordinary topics, the actual lessons containing in this book have been perverted into worship rites for a dark god.",
    });
  }
}

module.exports = TwistedTextbookEnemy;