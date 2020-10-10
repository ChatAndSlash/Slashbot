"use strict";

const Location = require('@app/content/locations').Location;
const Actions  = require('slacksimple').Actions;

const STATS = require('@constants').STATS;

/**
 * Casino.
 */
class Casino extends Location {
  constructor() {
    super({
      type: 'watermoon-gilded-casino',
      displayName: __('Fairlight Casino'),
      description: __("*Watermoon, Gilded District*\nYou're greeted at the door by the host, who welcomes you warmly.  \"Welcome to the Fairlight Casino, the fairest Casino in all of Watermoon!  Please, sit and play any or all of our fantastic games, and take a chance at winning amazing prizes!  Just 5 gold each to play!\""),
      image: 'locations/watermoon/casino.png',
      connectedLocations: [
        'watermoon-gilded-sterling_st',
      ],
    });
  }

  /**
   * Get the actions representing the games you can play.
   *
   * @param {Character} character - The character to get action buttons for.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    actions.addButton(__("5 Card Lucky"), "start_encounter", { params: { type: 'watermoon-gilded-5_card_lucky' } });
    actions.addButton(__("Top Card"), "start_encounter", { params: { type: 'watermoon-gilded-top_card' } });
    actions.addButton(__("Roll 'Em"), "start_encounter", { params: { type: 'watermoon-gilded-roll_em' } });

    const playedFiveCardLucky = character.hasStat(STATS.CASINO_GAMES_PLAYED, { subType: 'watermoon-gilded-5_card_lucky' });
    const playedTopCard = character.hasStat(STATS.CASINO_GAMES_PLAYED, { subType: 'watermoon-gilded-top_card' });
    const playedRollEm = character.hasStat(STATS.CASINO_GAMES_PLAYED, { subType: 'watermoon-gilded-roll_em' });

    if (playedFiveCardLucky && playedTopCard && playedRollEm) {
      actions.addButton(__("Complain"), "start_encounter", { params: { type: 'watermoon-gilded-complain' } });
    }

    return actions;
  }
}

module.exports = Casino;