"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const CrippleAction       = require('@mixins/enemy/actions/cripple').CrippleAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const Cripple = CrippleAction(20, {
  text: "Victorious Pitfighter strikes you in a sore spot, crippling your %s by %s for %d turns!",
});

class VictoriousPitfighterEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  Cripple,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-yard-victorious_pitfighter',
      displayName: "Victorious Pitfighter",
      description: "Covered in scars and wearing a muscle shirt to show off her impressive physique, this dangerous fighter carries only a small shield and a short sword - all she ever need to emerge victorious from every gladiatorial bout she’s been in.",
    });
  }
}

module.exports = VictoriousPitfighterEnemy;