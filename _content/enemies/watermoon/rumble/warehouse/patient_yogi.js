"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const HealAction          = require('@mixins/enemy/actions/heal').HealAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const SpitFire = BurnAction(20, {
  isRanged: true,
  dodgeText: ":dash: %s spits a ball of flame at you but you dodge!",
  missText: "%s spits a ball of flame at you but misses!",
  attackText: ":fire: %s spits a ball of flame at you, dealing %s damage.%s"
});

const Meditate = HealAction(10, {
  strength: 0.30,
  text: "%s meditates for a brief moment, healing himself of %d damage.",
});

class PatientYogiEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  SpitFire,
  Meditate,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-patient_yogi',
      displayName: "Patient Yogi",
      description: "Sitting before you with his legs crossed on top of each other is a thin man with dark skin.  He is wearing hoop earrings, a necklace made from what seems to be human skulls, and red paint on his shaven skull.  As he stands and strides towards you, you notice his arms and legs seem longer than a normal person's, in fact, much longer than they have any right to be.",
    });
  }
}

module.exports = PatientYogiEnemy;