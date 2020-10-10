"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction    = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class CentaurBladesmithEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttackAction(20, { multiplier: 2, text: "%s rears back and slams you with it's massive broadsword for %s damage!%s" }),
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-centaur_bladesmith',
      displayName: 'Centaur Bladesmith',
      description: "This Centaur has a variety of weapons strapped to his body, and makes ample use of each.  Most terrifying, though, is the massive, recently-forged broadsword you can see attached at his side.",
    });
  }
}

module.exports = CentaurBladesmithEnemy;