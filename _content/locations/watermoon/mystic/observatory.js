"use strict";

const Location = require('@app/content/locations').Location;
const Actions  = require('slacksimple').Actions;

const FLAGS = require('@constants').FLAGS;

const WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS = require('@constants').WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS;

/**
 * Observatory, where the portal to the plane of Shadow is located.
 */
class ObservatoryLocation extends Location {
  constructor() {
    super({
      type: 'watermoon-mystic-observatory',
      displayName: __('Observatory'),
      description: __("*Watermoon, Mystic District*\nThe Observatory is where scholars of the plane of Shadow, far in the sky above, would come to observe the twinkling lights of spirits and demigods.  Now, it stands empty, shelves of notes ransacked in a panic when the Necrodragon arrived."),
      image: 'locations/watermoon/observatory.png',
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

    if (character.hasFlag(FLAGS.SHADOW_PORTAL_OPEN)) {
      description += __("\n\nA whirling misty portal floats near the eyepiece at the base of the massive telescope.  Having been calmed by sufficient Essence Crystals, it is now safe to enter.");
    }
    else {
      description += __("\n\nA whirling misty portal floats near the eyepiece at the base of the massive telescope.  It spins far too quickly to enter safely.");

      if (character.inventory.has('quest-watermoon-essence_crystal', WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS)) {
        description += __("\n\nYou have sufficient Essence Crystals to open this portal.");
      }
      else {
        const required = WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS - character.inventory.quantity('quest-watermoon-essence_crystal');
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

    const portalClosed = ! character.hasFlag(FLAGS.SHADOW_PORTAL_OPEN);
    const hasCrystals = character.inventory.has('quest-watermoon-essence_crystal', WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS);

    if (portalClosed && hasCrystals) {
      actions.addButton(__("Unlock Portal"), "start_encounter", { params: { type: 'watermoon-mystic-unlock_portal', plane: 'shadow' } });
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

    if (character.hasFlag(FLAGS.SHADOW_PORTAL_OPEN) && ! character.hasFlag(FLAGS.SHADOW_BOSS_DEFEATED)) {
      locations.push('watermoon-mystic-plane_of_shadow');
    }

    return locations;
  }
}

module.exports = ObservatoryLocation;