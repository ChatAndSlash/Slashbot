"use strict";

const Location = require('@app/content/locations').Location;

/**
 * The Green Dragon Lair in the Forest Cave.
 */
class Lair extends Location {
  constructor() {
    super({
      type: 'tyrose-forest-cave-lair',
      displayName: __("Lair"),
      description: __('This spacious room found deep inside the forest cave is breathtaking, though terrifying.  A low light comes from somewhere unseen, bouncing off pools of acid that line the room.  Dark green crystals hang from the ceiling, with tiny drops of liquid occasionally falling and sending sizzling ripples across the pools beneath.'),
      image: 'locations/tyrose/green_dragon_lair.png',
      connectedLocations: [
        'tyrose-forest-cave',
      ],
      encounters: [
        { value: 'fight', weight: 100 },
      ],
      enemies: [
        { value: 'tyrose-lair-green_drake', weight: 8 },
        { value: 'tyrose-lair-green_dragon', weight: 2 },
      ]
    });
  }

  /**
   * Get the description for this location and character.
   * Indicate whether the dragon has been killed.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return array
   */
  getDescription(character) {
    return this._description
      + (character.hasKilledGreenDragon()
        ? __("\n\nWith the *Green Dragon* dead, this chamber is lifeless and barren.") // eslint-disable-line indent
        : __("\n\nIn the middle of the room is a giant *Green Dragon*, protected by a swarm of smaller green drakes.")); // eslint-disable-line indent
  }

  /**
   * Populate encounter choices.
   *
   * @param {Character} character - The character in this location.
   *
   * @return array
   */
  getEncounters(character) {
    // No encounters if you've killed the green dragon!
    if (character.hasKilledGreenDragon()) {
      return [];
    }

    // Should character encounter the pet collar?
    else if (character.level >= 8 &&
      character.pet.type === 'equipment-pets-000_no_pet' &&
      ! character.inventory.has('quest-pet_collar')) {
      return [{ value: 'forest-cave-pet_collar', weight: 100 }];
    }

    return super.getEncounters(character);
  }

  /**
   * Set the enemy level based on the character's level, with a maximum of 26, 36, or 46,
   * based on the number of Watermoon dragons killed.
   *
   * @param {Enemy} enemy - The enemy to get the level for.
   * @param {Character} character - The character in this location.
   *
   * @return {integer}
   */
  getEnemyLevel(enemy, character) {
    return 7;
  }
}

module.exports = Lair;