"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction           = require('@mixins/enemy/actions/burn').BurnAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const Molotov = BurnAction(20, {
  isRanged: true,
  dodgeText: ":dash: %s throw a molotov at you but you dodge!",
  missText: "%s throw a molotov at you but misses!",
  attackText: ":fire: %s throw a molotov at you, dealing %s damage.%s"
});

class FourthStreetAngelsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  Molotov,
  RecklessAttackAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-fourth_street_angels',
      displayName: "4th Street Angels",
      description: "A pile of reckless youths charge towards you, wearing predominantly purple and holding whatever improvised weapons they could get their hands on.  Some get distracted on their way, painting nearby walls with graffiti or throwing themselves in front of nearby carts and claiming they were mortally struck and demanding payment.  Still, enough of them reach you and begin to attack that you're forced to take them seriously.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = FourthStreetAngelsEnemy;