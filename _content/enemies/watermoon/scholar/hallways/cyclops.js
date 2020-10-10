"use strict";

const mix                  = require('mixwith').mix;
const WatermoonEnemy       = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation  = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction        = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction        = require('@mixins/enemy/actions/concuss').ConcussAction;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;
const DropsMoondrop        = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const Concuss = ConcussAction(20, {
  text: "%s bashes you with its club, dealing %s damage and concussing you!%s",
});

const RecklessAction = RecklessAttackAction(20, {
  text: "%s smashes you with its bare fists, dealing %s damage and taking %s damage in return!%s"
});

class CyclopsEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  Concuss,
  RecklessAction,
  DropsMoondrop(4),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallways-cyclops',
      displayName: 'Cyclops',
      description: "This massive, furious, one-eyed monster carries a massive wooden club, but in its fury, frequently forgets to use it.",
    });
  }
}

module.exports = CyclopsEnemy;