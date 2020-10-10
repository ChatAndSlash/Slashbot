"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DropsClues          = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class JinxedJournalEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CurseAction(20),
  DropsClues(85, 2, 4),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-jinxed_journal',
      displayName: 'Jinxed Journal',
      description: "The journal of one Archius Malenthus, a mage of some ill-repute.  Doubtless, some of his reputation is deserved, but his true downfall was recording his thoughts and experiments in this journal, which broadcasted a tarted-up version of the contents to every magical centre in the world.",
    });
  }
}

module.exports = JinxedJournalEnemy;