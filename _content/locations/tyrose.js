"use strict";

const { mix }           = require('mixwith');
const { Location }      = require('@app/content/locations');
const { CrierLocation } = require('@mixins/location/crier');

const FLAGS = require('@constants').FLAGS;

/**
 * The city of Tyrose.
 */
class CityOfTyrose extends mix(Location).with(
  CrierLocation()
) {
  constructor() {
    super({
      type: 'tyrose',
      displayName: "City of Tyrose, Town Center",
      image: 'locations/city.png',
      connectedLocations: [
        'tyrose-forest',
        'tyrose-tavern',
        'tyrose-shoppes',
        'tyrose-party_central',
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
    if (['tyrose-forest', 'stagecoach'].includes(character.location.type)) {
      return "City of Tyrose";
    }

    return "Town Center";
  }

  /**
   * Get the description. Changes if the Cave has been found, and if the Green Dragon has been killed.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    if (character.hasKilledGreenDragon()) {
      return "Tyrose is a changed town.  Instead of ill-repaired buildings and skulking citizens, new stonework graces the streets and the people strut about in the finest of clothes.  The shoppes are bustling, the tavern is rowdy, and even the stagecoach is back in operation, ferrying people to and from all kinds of destinations.\n\nIn the center of the town stands the little girl with a bundle of torches.  She seems far less sad than before, though you wouldn't really call her happy."
        + super.getCrierText(character);
    }

    let description = "You stand in the main square of the city of Tyrose.  While not a small town, there aren't many people around.  Many of the shoppes are shuttered, and most of the houses stand empty.  Obviously, the Green Dragon rampaging through the nearby lands has taken a toll on this town.";

    if (this.isTrainerPresent(character)) {
      description += "\n\nThe trainer sits on a plain wooden stool, eyes closed, yet seemingly aware of all around him.";
    }

    if (character.hasFlag(FLAGS.FOREST_CAVE_DISCOVERED)) {
      description += "\n\nIn the center of the town stands a sad-looking little girl with a bundle of torches.  Despite the warmth of the summer, she is shivering.";
    }

    return description + super.getCrierText(character);
  }

  /**
   * Get the locations connected to this location.
   * If Green Dragon has been killed, add stagecoach.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    let locations = _.clone(this._connectedLocations);

    if (character.hasKilledGreenDragon()) {
      locations.unshift('stagecoach');
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

    actions.addButton("Fortune Teller", "start_encounter", { params: { type: 'tyrose-fortune_teller' } });

    if (this.isTrainerPresent(character)) {
      actions.addButton("Trainer", "train");
    }

    return super.addMiscActions(character, actions);
  }

  /**
   * If the character has discovered the cave or is further, they can buy torches.
   *
   * @param {Character} character - The character buying torches.
   *
   * @return {boolean}
   */
  canBuyTorches(character) {
    return character.hasKilledGreenDragon() || character.hasFlag(FLAGS.FOREST_CAVE_DISCOVERED);
  }

  /**
   * Display a buy action button for this location.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {array}
   */
  addBuyActions(character, actions) {
    // If you've discovered the cave, you can buy torches
    if (this.canBuyTorches(character)) {
      actions.addButton("Little Torch Girl", 'buy', { params: { action: "list", type: 'torches' } });
    }

    return actions;
  }

  /**
   * Get the items this location sells.
   *
   * @param {Character} character - The character doing the buying.
   * @param {string} type - The type of items being sold.
   *
   * @return {array}
   */
  getShopItemsByType(character, type) {
    // If you've discovered the cave, you can buy torches
    if (this.canBuyTorches(character) && type === 'torches') {
      return ['torch'];
    }

    return super.getShopItemsByType(character, type);
  }

  /**
   * The trainer is only present if you've trained your first skill with him in the forest.
   *
   * @param {Character} character - The character looking to train.
   *
   * @return boolean
   */
  isTrainerPresent(character) {
    return (character.profession.type === 'novice' && character.profession.spSpent > 0) || character.profession.type !== 'novice';
  }
}

module.exports = CityOfTyrose;