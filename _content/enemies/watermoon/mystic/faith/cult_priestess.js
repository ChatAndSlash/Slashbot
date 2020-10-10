"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const HealAction          = require('@mixins/enemy/actions/heal').HealAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const CastCureAction = HealAction(10, {
  strength: 0.30,
  text: "%s gathers magical energy and casts Cure, healing themselves of %d damage.",
});

class CultPriestEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CurseAction(20),
  CastCureAction,
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-cult_priestess',
      displayName: 'Cult Priestess',
      description: "You hear the chanting of this priestess long before you see her, but you don't actually see her until she's nearly on top of you.  Despite her bright purple robes and swinging incense censer, she seems to come out of almost nowhere to attack you!",
    });
  }
}

module.exports = CultPriestEnemy;