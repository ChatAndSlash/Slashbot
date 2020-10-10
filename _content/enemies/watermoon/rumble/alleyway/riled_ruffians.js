"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class RiledRuffiansEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  StunAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-riled_ruffians',
      displayName: "Riled Ruffians",
      description: "You can’t tell what got this group of goons all riled up, but they’re rarin’ to go, and eager to have a solid punch-up with you.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = RiledRuffiansEnemy;