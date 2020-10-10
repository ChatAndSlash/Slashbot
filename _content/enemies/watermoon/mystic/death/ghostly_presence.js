"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class GhostlyPresenceEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-ghostly_presence',
      displayName: 'Ghostly Presence',
      description: "You can only detect this phantom once it attacks you and its rage fully manifests.  It doesn't have a clear shape that you can focus on, but hitting it definitely seems to harm to.  To battle!",
    });
  }
}

module.exports = GhostlyPresenceEnemy;