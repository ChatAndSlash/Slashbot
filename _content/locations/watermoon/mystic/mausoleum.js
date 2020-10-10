"use strict";

const Location = require('@app/content/locations').Location;
const Actions  = require('slacksimple').Actions;

const FLAGS = require('@constants').FLAGS;

const WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS = require('@constants').WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS;

/**
 * Mausoleum, where the portal to the plane of Death is located.
 */
class MausoleumLocation extends Location {
  constructor() {
    super({
      type: 'watermoon-mystic-mausoleum',
      displayName: __('Mausoleum'),
      description: __("*Watermoon, Mystic District*\nThe Mausoleum is where all previous High Magisters are interred after they pass, and as such acts as an immense focus for magical energy."),
      image: 'locations/watermoon/mausoleum.png',
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

    if (character.hasFlag(FLAGS.DEATH_PORTAL_OPEN)) {
      description += __("\n\nA whirling inky portal floats in the center of the tombs.  Having been calmed by sufficient Essence Crystals, it is now safe to enter.");
    }
    else {
      description += __("\n\nA whirling inky portal floats in the center of the tombs.  It spins far too quickly to enter safely.");

      if (character.inventory.has('quest-watermoon-essence_crystal', WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS)) {
        description += __("\n\nYou have sufficient Essence Crystals to open this portal.");
      }
      else {
        const required = WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS - character.inventory.quantity('quest-watermoon-essence_crystal');
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

    const portalClosed = ! character.hasFlag(FLAGS.DEATH_PORTAL_OPEN);
    const hasCrystals = character.inventory.has('quest-watermoon-essence_crystal', WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS);

    if (portalClosed && hasCrystals) {
      actions.addButton(__("Unlock Portal"), "start_encounter", { params: { type: 'watermoon-mystic-unlock_portal', plane: 'death' } });
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

    if (character.hasFlag(FLAGS.DEATH_PORTAL_OPEN) && ! character.hasFlag(FLAGS.DEATH_BOSS_DEFEATED)) {
      locations.push('watermoon-mystic-plane_of_death');
    }

    return locations;
  }
}

module.exports = MausoleumLocation;