"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class SullenScapegraceEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DazeAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-sullen_scapegrace',
      displayName: "Sullen Scapegrace",
      description: "You can tell this guy doesn’t want to be here. He’d rather be at home, reading a book, curling up in front of a fire, drinking hot cocoa or something of the like.  But instead he’s here, forced to fight people he doesn’t want to, on the order of people he doesn’t like.  Life isn’t fair sometimes.",
    });
  }
}

module.exports = SullenScapegraceEnemy;