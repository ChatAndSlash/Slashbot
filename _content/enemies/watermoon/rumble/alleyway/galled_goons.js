"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const PowerAttack = PowerAttackAction(20, {
  multiplier: 2,
  text: "%s charge you and pound on you fiercely for %s damage!%s"
});

class GalledGoonsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttack,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-galled_goons',
      displayName: "Galled Goons",
      description: "You can definitely tell that you’re intruding when you come across this group of goons.  With cries of “G’won!” and “Giddadaheah!”, they menacingly walk towards you.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = GalledGoonsEnemy;