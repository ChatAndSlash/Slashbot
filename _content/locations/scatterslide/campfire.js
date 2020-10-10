"use strict";

const { mix }           = require('mixwith');
const { Actions }       = require('slacksimple');
const { Location }      = require('@app/content/locations');
const { CrierLocation } = require('@mixins/location/crier');

const { PROFESSIONS, STATS } = require('@constants');

class Campfire extends mix(Location).with(
  CrierLocation()
) {
  constructor() {
    super({
      type: 'scatterslide-campfire',
      displayName: __('Scatterslide Mines, Campfire'),
      image: 'locations/scatterslide/campfire.png',
      connectedLocations: [
        'stagecoach',
        'scatterslide-quarry',
        'scatterslide-merchants',
        'scatterslide-party_central',
      ],
      hasMysteriousMerchant: true,
      hasHolidayDrakes: true,
    });
  }

  /**
   * Pretend this location doesn't have any items, so we don't show buttons to buy.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {boolean}
   */
  hasShopItems(character) {
    return false;
  }

  /**
   * Pretend this location doesn't have any pets, so we don't show buttons to buy.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {boolean}
   */
  hasShopPets(character) {
    return false;
  }

  /**
   * Get the text for this location to display on the travel button.
   *
   * @param {Character} character - The character travelling.
   *
   * @return {string}
   */
  getButtonText(character) {
    return character.location.type === 'stagecoach'
      ? __("Scatterslide Mines")
      : __("Campfire");
  }

  /**
   * Get the description for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = '';

    // Scatterslide is clear!
    if (character.hasKilledBrownDragon()) {
      description = __("A jubilant group is thronging around a roaring campfire.  Surrounding them is a bustling mining camp, and in the distance is an active quarry.  The miners clap you on the back as you approach, and they proudly inform you of their progress towards restarting mining operations.");
    }
    // Rebuilding
    else if (character.hasStat(STATS.SCATTERSLIDE_INTRO)) {

      description = __("A hopeful group is milling around a large campfire.  They come from a variety of professions, and offer to teach you what they know to increase your chance of success.  ");
      const blacksmithBuilt = character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT);
      const artificerBuilt  = character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT);

      if ( ! blacksmithBuilt && ! artificerBuilt) {
        description += __("Surrounding them is a ruined mining camp, and in the distance is an abandoned quarry.  A group of merchants stand nearby, offering a varity of equipment and supplies.");
      }
      else if (blacksmithBuilt && artificerBuilt) {
        description += __("Surrounding them is a rebuilt mining camp, and in the distance is an abandoned quarry.  A group of merchants stand nearby, offering a varity of equipment and supplies.");
      }
      else {
        description += __("Surrounding them is a partially-rebuilt mining camp, and in the distance is an abandoned quarry.  A group of merchants stand nearby, offering a varity of equipment and supplies.");
      }
    }
    // Just starting
    else {
      description = __("A small group is huddled around a guttering campfire.  Surrounding them is a ruined mining camp, and in the distance is an abandoned quarry. A burly man notices you and motions you over.");
    }

    return description + super.getCrierText(character);
  }

  /**
   * If you have no mining pick, only option is to start encounter that is intro to this area.
   *
   * @param {Character} character - The character to get action buttons for.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    if ( ! character.hasStat(STATS.SCATTERSLIDE_INTRO)) {
      actions.addButton(__("Approach Foreman"), "start_encounter", { params: { type: 'scatterslide-intro' } });

      return actions;
    }

    actions = super.addCrierButton(actions);

    if ( ! (character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT) && character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT))) {
      actions.addButton(__("Rebuild"), "start_encounter", { params: { type: 'scatterslide-rebuild' } });
    }

    actions.addButton(__("Trainer"), "train");
    actions = super.getActions(character, actions);

    return actions;
  }

  /**
   * Get the locations connected to this location.  Allows for custom logic on a per-location, per-character basis.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    // Can't go anywhere until you talk to the foreman
    if ( ! character.hasStat(STATS.SCATTERSLIDE_INTRO)) {
      return [];
    }

    return this._connectedLocations;
  }

  /**
   * Get the professions that the character can change to at this location.
   *
   * @param {Character} character - The character looking to change professions.
   *
   * @return {array}
   */
  getAvailableProfessions(character) {
    return [
      PROFESSIONS.NOVICE,
      PROFESSIONS.BARD,
      PROFESSIONS.CARAVAN_GUARD,
      PROFESSIONS.MERCENARY,
    ].filter((value) => {
      return character.profession.type !== value;
    });
  }
}

module.exports = Campfire;