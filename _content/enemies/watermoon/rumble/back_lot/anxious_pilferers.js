"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DefendAction         = require('@mixins/enemy/actions/defend').DefendAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class AnxiousPilferersEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  RecklessAttackAction(20),
  DefendAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-back_lot-anxious_pilferers',
      displayName: "Anxious Pilferers",
      description: "Nervous and muttering amongst themselves, these gang members nonetheless attack you, some of them grabbing at your purse and loosely-attached belongings as they do so.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = AnxiousPilferersEnemy;