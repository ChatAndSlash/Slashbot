"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BansheeEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-banshee',
      displayName: 'Banshee',
      description: "This headless woman is bare from the waist up, her entire upper body a ruined canvas of gore.  She is holding a bowl full of blood and is somehow, despite her cranial deficiency, wailing for all she's worth.",
    });
  }
}

module.exports = BansheeEnemy;