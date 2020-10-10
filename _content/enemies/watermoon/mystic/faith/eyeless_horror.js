"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class EyelessHorrorEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CurseAction(15, { text: "%s screams violently and chills you to the bone, inflicting a terrifying _curse_ on you!" }),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-eyeless_horror',
      displayName: 'Eyeless Horror',
      description: "This shambling creature is a sight to behold - which is ironic, because though it has a huge mouth full of sharp teeth, long, pointed ears, and a bulbous, pulsing nose, it has no eyes.  Perhaps it's for the best...",
    });
  }
}

module.exports = EyelessHorrorEnemy;