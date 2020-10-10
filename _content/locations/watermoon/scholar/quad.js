"use strict";

const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;

/**
 * Quad.  Hub.
 */
class QuadLocation extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-scholar-quad',
      displayName: __('Quad'),
      description: "*Watermoon, Scholar District*\nThe Scholar District Quadrangle is a wonderful courtyard between classroom buildings on either side, the fountain behind, and the library in front.  Other than for a single disheveled young woman wearing an apprentice's uniform sitting next to a mountain of books, it is completely devoid of people.",
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-fountain',
        'watermoon-scholar-library',
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
      ? __("Scholar District")
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

    if (this.hasLabyrinthKey(character)) {
      description += __("\n\nThe door to the labyrinth blocks off a tunnel that descends through the center of the quad.  You grip the key in your hand, ready to descend.");
    }
    else {
      description += __("\n\nA massive locked door blocks off a tunnel that descends through the center of the quad.");
    }

    return description;
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
    if (this.hasLabyrinthKey(character)) {
      actions.addButton(__("Approach Apprentice"), "start_encounter", { params: { type: 'watermoon-scholar-apprentice_advice' } });
      actions.addButton(__("Enter Labyrinth"), "labyrinth_enter", { confirm: {
        title: __("Are you sure?  This labyrinth is confusing."),
        text: __("Once you enter the labyrinth, you'll need to keep moving forward until you reach a checkpoint, or you'll lose all your progress.  This can be quite a while! Are you sure you want to enter?"),
        ok_text: __("Enter!"),
        dismiss_text: __("Not yet...")
      }});
    }
    else {
      actions.addButton(__("Approach Apprentice"), "start_encounter", { params: { type: 'watermoon-scholar-apprentice_intro' } });
    }

    return actions;
  }

  /**
   * If the provided character has the labyrinth key used in the Scholar District.
   *
   * @param {Character} character - The character to check.
   *
   * @return boolean
   */
  hasLabyrinthKey(character) {
    return character.inventory.has('tool-labyrinth_key');
  }
}

module.exports = QuadLocation;