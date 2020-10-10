"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const PowerAttackAction    = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsClues           = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SinisterSelfHelpBookEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  PowerAttackAction(20, { text: "%s distracts you with some stunningly bad advice, then riffles razor-sharp pages at you for %s damage!%s" }),
  DropsClues(90, 2, 4),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-sinister_selfhelp_book',
      displayName: 'Sinister Self-Help Book',
      description: "It should go without saying that you do not want to follow the advice contained herein.  The \"Quotes and Praise\" section on the back of the book is full of such gems as \"I used to have a troublesome head, and now that problem's solved!  Thanks!\" and \"This book fixed my troubled marriage.  I don't have a wife anymore!  And I'm in jail!\".  Even interacting with this book can prove fatal.",
    });
  }
}

module.exports = SinisterSelfHelpBookEnemy;