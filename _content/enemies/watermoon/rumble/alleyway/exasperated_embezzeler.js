"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class ExasperatedEmbezzelerEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ConcussAction(20),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-alleyway-exasperated_embezzeler',
      displayName: "Exasperated Embezzeler",
      description: "Though not normally one for physical conflict, this white-collar criminal is sick and tired of office work and has taken to the street to work out her frustration.",
    });
  }
}

module.exports = ExasperatedEmbezzelerEnemy;