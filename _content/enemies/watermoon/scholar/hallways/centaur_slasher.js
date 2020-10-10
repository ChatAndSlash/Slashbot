"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction    = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class CentaurSlasherEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttackAction(20, { text: "%s hits you with an extra-powerful whirling spinslash attack for %s damage!%s" }),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-centaur_slasher',
      displayName: 'Centaur Slasher',
      description: 'Her body covered in scars, this proud centaur gracefully wields two swords with deadly-sharp-looking edges.',
    });
  }
}

module.exports = CentaurSlasherEnemy;