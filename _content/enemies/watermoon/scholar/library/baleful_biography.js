"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DropsClues           = require('@mixins/enemy/loot/clue').DropsClues;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

class BalefulBiographyEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  RecklessAttackAction(30),
  DropsClues(60, 1, 3),
  DropsMoondrop(3),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-library-baleful_biography',
      displayName: 'Baleful Biography',
      description: "An exposé of the terrible and morally sick mage Archius Malenthus, the author of this biography has written in such a reckless, style that the animated book has taken on its author's style.",
    });
  }
}

module.exports = BalefulBiographyEnemy;