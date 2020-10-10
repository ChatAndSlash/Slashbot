"use strict";

const mix            = require('mixwith').mix;
const ReputationItem = require('@app/content/items/reputation').ReputationItem;
const ScaleCost      = require('@mixins/item/scale_cost').ScaleCost;

const STATS = require('@constants').STATS;

class DoubleheadCoinReputation extends mix(ReputationItem).with(ScaleCost(35)) {
  constructor() {
    super({
      type: 'reputation-doublehead_coin',
      displayName: __('Doublehead Coin'),
      description: __('A shiny coin with a printing error - both sides are heads.  Particularly prized by the denizens of the Watermoon Gilded District.'),
      maxQuantity: 1,
    });
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param Character character The character to evaluate against.
   *
   * @return string
   */
  getShopDescription(character) {
    return __("Gain +1000 Watermoon Reputation, and doubles all Watermoon Reputation gained.");
  }

  /**
   * Add Watermoon reputation.
   *
   * @param {Character} character - The character buying this item.
   * @param {integer} quantity - The quantity of items being bought.
   */
  doBuyActions(character, quantity) {
    character.increaseStat(STATS.REPUTATION_GAINED, 1000, STATS.WATERMOON_REPUTATION);
    character.slashbot.say(__(":speaking_head_in_silhouette: You gained 1000 Watermoon reputation."), character);
  }
}

module.exports = DoubleheadCoinReputation;