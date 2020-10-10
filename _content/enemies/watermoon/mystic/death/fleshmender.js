"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const HealAction          = require('@mixins/enemy/actions/heal').HealAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FleshmendAction = HealAction(20, {
  text: "%s grabs a nearby corpse and sews a piece of flesh across its wounds, healing itself of %d damage."
});

class FleshmenderEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  FleshmendAction,
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-fleshmender',
      displayName: 'Fleshmender',
      description: "At first, you have a hard time identifying what kind of creature this is, but you soon figure out that it is actually several creatures sewn together.  Clearly, this beast functions as a macabre medic for the other undead, and has liberally practiced its arts upon itself.",
    });
  }
}

module.exports = FleshmenderEnemy;