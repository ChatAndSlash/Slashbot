"use strict";

const Location = require('@app/content/locations').Location;

const STATS = require('@constants').STATS;

/**
 * The stagecoach connecting Tyrose, Scatterslide Mines, and Watermoon.
 */
class Stagecoach extends Location {
  constructor() {
    super({
      type: 'stagecoach',
      displayName: __('Stagecoach'),
      buttonText: __("Stagecoach"),
      description: __('A stagecoach waits here, packing in the belongings of its travelers.'),
      image: 'locations/stagecoach.png',
      connectedLocations: [
        'tyrose',
        'scatterslide-campfire',
      ],
      travelCost: 1,
    });
  }

  /**
   * Get the locations connected to this location.
   * If Brown Dragon has been killed, add Watermoon.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (this.canTravelToWatermoon(character)) {
      locations.push('watermoon-fountain');
    }

    return locations;
  }

  /**
   * Display misc action buttons for this location.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {array}
   */
  addMiscActions(character, actions) {
    // Haven't seen Watermoon intro, even though you've killed the brown dragon?
    if (character.hasKilledBrownDragon() && ! this.hasSeenWatermoonIntro(character)) {
      actions.addButton(__("Travel to Watermoon"), "start_encounter", { params: { type: 'watermoon-intro' } });
    }

    return actions;
  }

  /**
   * Can only travel to Watermoon if you've killed the brown dragon and gone through the intro.
   * If you have the intro flag or have killed a Watermoon dragon?  You've seen the intro.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  canTravelToWatermoon(character) {
    return character.hasKilledBrownDragon() && this.hasSeenWatermoonIntro(character);
  }

  /**
   * You've seen the intro if you have the flag or have killed a Watermoon dragon.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  hasSeenWatermoonIntro(character) {
    return character.hasStat(STATS.WATERMOON_INTRO);
  }
}

module.exports = Stagecoach;