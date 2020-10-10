"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const Concuss = ConcussAction(20, {
  text: "%s flings its tears at you, causing sparks to explode in your mind, dealing %s damage, and concussing you!%s",
});

class WeepingEidolonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BerserkAction(20),
  Concuss,
  DropsMoondrop(100, 1, 2),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-weeping_eidolon',
      displayName: 'Weeping Eidolon',
      description: "You hear the echoing wails of this silvery phantasm long before you encounter it, and though it attacks you on seeing you, it does not appear that it does so with any particular malice, only a somber sense of duty.",
    });
  }
}

module.exports = WeepingEidolonEnemy;