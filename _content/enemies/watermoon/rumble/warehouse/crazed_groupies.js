"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const MultiAttackAction    = require('@mixins/enemy/actions/multi_attack').MultiAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const Swarm = RecklessAttackAction(20, {
  text: "%s swarm you heedless of personal safety, dealing %s damage and taking %s damage in return!%s"
});

const Slices = MultiAttackAction(20, {
  minAttacks: 2,
  maxAttacks: 4,
  preText: ":triumph: %s draw their swords and attack as one!",
  attackText: ":frowning: %s slice you for %s damage.%s",
});

class CrazedGroupiesEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  Swarm,
  Slices,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-warehouse-crazed_groupies',
      displayName: "Crazed Groupies",
      description: "A group of young adults, barely out of their teens, come howling around a corner at you.  They wear fitted black jackets and domino masks, and wield a variety of blades that look more expensive than effective.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = CrazedGroupiesEnemy;