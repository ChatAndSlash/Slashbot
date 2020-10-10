"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class ResentfulRapscallionsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-resentful_rapscallions',
      displayName: "Resentful Rapscallions",
      description: "Muttering amongst themselves about how “they shouldn’t even *be* here today,” these youthful thugs still attack you, even though you can tell their hearts aren’t really in it.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = ResentfulRapscallionsEnemy;