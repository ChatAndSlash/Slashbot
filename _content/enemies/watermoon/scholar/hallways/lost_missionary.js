"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const HealAction          = require('@mixins/enemy/actions/heal').HealAction;

const CastCureAction = HealAction(15, {
  text: "%s gathers magical energy and casts Cure, healing themselves of %d damage."
});

class LostMissionaryEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CastCureAction,
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-lost_missionary',
      displayName: 'Lost Missionary',
      description: "Originally having entered this labyrinth to preach to its inhabitants, this fanatic is now possessed of only rags and screaming vague, half-remembered bits of scriptures.",
    });

    this.stats.perLevel.goldMin = 0;
    this.stats.perLevel.goldMax = 0;
  }
}

module.exports = LostMissionaryEnemy;