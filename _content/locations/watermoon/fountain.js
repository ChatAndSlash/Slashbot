"use strict";

const { mix }               = require('mixwith');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { CrierLocation }     = require('@mixins/location/crier');

const { PROFESSIONS } = require('@constants');

/**
 * Fountain.  Hub between districts.
 */
class Fountain extends mix(WatermoonLocation).with(CrierLocation()) {
  constructor() {
    super({
      type: 'watermoon-fountain',
      displayName: __('Watermoon Fountain'),
      buttonText: __("Fountain"),
      description: __("You stand before a beautiful fountain with water dancing all around it.  In the center is a gigantic, golden statue of a dragon, though it doesn't look especially like Aureth, or any other dragon you recognize.  Sitting at the base of the fountain is a familiar figure - a cowled woman with a crystal ball."),
      image: 'locations/city.png',
      connectedLocations: [
        'stagecoach',
        'watermoon-gilded-courtyard',
        'watermoon-rumble-laneway',
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
   * Get the description for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    return this._description + super.getCrierText(character);
  }

  /**
   * Get the text for this location to display on the travel button.
   *
   * @param Character character The character travelling.
   *
   * @return string
   */
  getButtonText(character) {
    return character.location.type === 'stagecoach'
      ? __("Watermoon")
      : this.buttonText;
  }

  /**
   * Get the locations connected to this location.  Allows for custom logic on a per-location, per-character basis.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (character.hasKilledRedDragon()) {
      locations.push('watermoon-scholar-quad');
    }

    if (character.hasKilledBlackDragon()) {
      locations.push('watermoon-mystic-plaza');
    }

    return locations;
  }

  /**
   * Display misc actions for this location.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {array}
   */
  addMiscActions(character, actions) {
    actions = super.addCrierButton(actions);
    actions.addButton("Fortune Teller", "start_encounter", { params: { type: 'watermoon-fortune_teller' } });

    if (this.hasLystone(character)) {
      actions.addButton("Cloaked Figure", "start_encounter", { params: { type: 'watermoon-cloaked_figure' } });
    }

    if (character.isInTestMode()) {
      actions.addButton("Modify Dragon State", "start_encounter", { params: { type: 'watermoon-modify_dragons' } });
    }

    return super.addMiscActions(character, actions);
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
      PROFESSIONS.LYCA,
    ].filter((value) => {
      return character.profession.type !== value;
    });
  }
}

module.exports = Fountain;