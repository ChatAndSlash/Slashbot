"use strict";

const Location = require('@app/content/locations').Location;
const Actions  = require('slacksimple').Actions;

const FLAGS = require('@constants').FLAGS;

const WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS = require('@constants').WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS;

/**
 * Lodge, where the portal to the plane of Faith is located.
 */
class LodgeLocation extends Location {
  constructor() {
    super({
      type: 'watermoon-mystic-lodge',
      displayName: __('Lodge'),
      description: __("*Watermoon, Mystic District*\nThis is where the cult of the Old Ones convened, back when the power of the High Magister protected them from the worst excesses of their worship.  Now, many have fallen to madness and even fled into the Plane of Faith itself to serve."),
      image: 'locations/watermoon/lodge.png',
      connectedLocations: [
        'watermoon-mystic-plaza',
      ],
    });
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
    let description = this._description;

    if (character.hasFlag(FLAGS.FAITH_PORTAL_OPEN)) {
      description += __("\n\nA whirling lavender portal floats at the bottom of a set of hidden stairs.  Having been calmed by sufficient Essence Crystals, it is now safe to enter.");
    }
    else {
      description += __("\n\nA whirling lavender portal floats at the bottom of a set of hidden stairs.  It spins far too quickly to enter safely.");

      if (character.inventory.has('quest-watermoon-essence_crystal', WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS)) {
        description += __("\n\nYou have sufficient Essence Crystals to open this portal.");
      }
      else {
        const required = WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS - character.inventory.quantity('quest-watermoon-essence_crystal');
        description += __("\n\nYou still require %d more Essence Crystals to open this portal.", required);
      }
    }

    return description;
  }

  /**
   * Get actions for entering the portal, if available.
   *
   * @param {Character} character - The character to get action buttons for.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    const portalClosed = ! character.hasFlag(FLAGS.FAITH_PORTAL_OPEN);
    const hasCrystals = character.inventory.has('quest-watermoon-essence_crystal', WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS);

    if (portalClosed && hasCrystals) {
      actions.addButton(__("Unlock Portal"), "start_encounter", { params: { type: 'watermoon-mystic-unlock_portal', plane: 'faith' } });
    }

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
    let locations = _.clone(this._connectedLocations);

    if (character.hasFlag(FLAGS.FAITH_PORTAL_OPEN) && ! character.hasFlag(FLAGS.FAITH_BOSS_DEFEATED)) {
      locations.push('watermoon-mystic-plane_of_faith');
    }

    return locations;
  }
}

module.exports = LodgeLocation;