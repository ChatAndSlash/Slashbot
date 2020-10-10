"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DefendAction        = require('@mixins/enemy/actions/defend').DefendAction;

class LostSurvivorEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DefendAction(20),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-lost_survivor',
      displayName: 'Lost Survivor',
      description: "This lady has clearly been living in these hallways for quite some time, having been reduced to scavenging to survive.  Her fine clothing is all but tatters, and her armour is cobbled together from the hides and carapaces that adventurers have defeated as they pass through the halls.  Truly, she must be desperate to attack you.",
    });

    this.stats.perLevel.goldMin = 0;
    this.stats.perLevel.goldMax = 0;
  }
}

module.exports = LostSurvivorEnemy;