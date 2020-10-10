"use strict";

const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;

/**
 * Plaza.  Hub.
 */
class PlazaLocation extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-mystic-plaza',
      displayName: __('Plaza'),
      description: "*Watermoon, Mystic District*\nThe Mystic Plaza used to be full of enchanted wonders that drew visitors from all over.  Without the High Magister to sustain them, they are all overgrown, disused, and broken.",
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-fountain',
        'watermoon-mystic-workshop',
        'watermoon-mystic-lodge',
        'watermoon-mystic-observatory',
        'watermoon-mystic-mausoleum',
      ],
    });
  }

  /**
   * Get the text for this location to display on the travel button.
   *
   * @param {Character} character - The character travelling.
   *
   * @return string
   */
  getButtonText(character) {
    return 'watermoon-fountain' === character.location.type
      ? __("Mystic District")
      : this.getDisplayName(character);
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
    let description = __(this._description);

    if (this.hasDowsingStaff(character)) {
      description += __("  The caretaker sits in a simple chair nearby, smoking and not doing much else.");
    }
    else {
      description += __("  A tall man sits in a simple chair nearby, smoking and not doing much else.");
    }

    return description;
  }

  /**
   * Get the locations connected to this location.  Allows for custom logic on a per-location, per-character basis.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    return this.hasDowsingStaff(character) ? this._connectedLocations : [];
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
    if (this.hasDowsingStaff(character)) {
      actions.addButton(__("Approach Catacombs"), "start_encounter", { params: { type: 'watermoon-mystic-catacombs' } });
    }
    else {
      actions.addButton(__("Caretaker"), "start_encounter", { params: { type: 'watermoon-mystic-caretaker' } });
    }

    return actions;
  }

  /**
   * If the provided character has the dowsing staff used in the Mystic District.
   *
   * @param {Character} character - The character to check.
   *
   * @return boolean
   */
  hasDowsingStaff(character) {
    return character.inventory.has('tool-dowsing_staff');
  }
}

module.exports = PlazaLocation;