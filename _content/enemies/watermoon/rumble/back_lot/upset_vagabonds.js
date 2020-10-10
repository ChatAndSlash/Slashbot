"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const BlindAction          = require('@mixins/enemy/actions/blind').BlindAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

class UpsetVagabondsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  RecklessAttackAction(20),
  BlindAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-back_lot-upset_vagabonds',
      displayName: "Upset Vagabonds",
      description: "Wearing threadbare and torn rags, these street ruffians nonetheless have no shortage of decent weapons to attack you with.  They seem especially upset with you, though they’re not especially keen to explain themselves.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = UpsetVagabondsEnemy;