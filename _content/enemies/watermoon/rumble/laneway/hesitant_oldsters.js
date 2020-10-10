"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DoNothingAction     = require('@mixins/enemy/actions/do_nothing').DoNothingAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const PROPERTIES = require('@constants').PROPERTIES;

const DoNothing = DoNothingAction(20, {
  text: "%s aren't especially keen on engaging you right now.",
});

class HesitantOldstersEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DoNothing,
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-laneway-hesitant_oldsters',
      displayName: "Hesitant Oldsters",
      description: "These old men are clearly past their prime, but still ready to rumble.  Well, mostly ready.  None of them are keen to be the first into battle, “gallantly” offering the opportunity to each other, over and over.",
      isAre: 'are',
      properties: [
        PROPERTIES.IS_GROUP,
      ]
    });
  }
}

module.exports = HesitantOldstersEnemy;