"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const HealAction          = require('@mixins/enemy/actions/heal').HealAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const CastCureAction = HealAction(10, {
  strength: 0.15,
  text: "%s gathers magical energy and casts Cure, healing themselves of %d damage.",
});

class CentaurFaithfulEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CastCureAction,
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-centaur_faithful',
      displayName: 'Centaur Faithful',
      description: "This centaur carries a long staff with a holy symbol high atop it.  Unfortunately for you, the centaur holy symbol is a sharpened, seven-pointed star.",
    });
  }
}

module.exports = CentaurFaithfulEnemy;