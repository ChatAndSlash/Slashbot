"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SkeletonBallEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(5),
  WatermoonReputation(2)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-death-skeleton_ball',
      displayName: 'Skeleton Ball',
      description: "This huge ball of bones seems to maintain its own momentum despite any external factors.  If you're not careful, it'll roll over you and crush you flat!",
    });
  }
}

module.exports = SkeletonBallEnemy;