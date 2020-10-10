"use strict";

const Location = require('@app/content/locations').Location;

/**
 * The pet shop in the city of Tyrose.
 */
class Pets extends Location {
  constructor() {
    super({
      type: 'tyrose-shoppes-pets',
      displayName: __("Karl's Kats"),
      buttonText: __("Pet Store"),
      description: __('Karl, the proprietor, approaches you holding an adorable kitten. "We\'ve got a few cats ready for adoption today," he says. "Or, if you want to pick up an old pet you\'ve stabled, we\'re connected to the stable network, so you can access your entire stable of pets."'),
      image: 'locations/tyrose/pets.png',
      connectedLocations: [
        'tyrose-shoppes',
      ],
      shopPets: [
        'equipment-pets-midnight',
        'equipment-pets-lancelot',
        'equipment-pets-rory',
      ],
    });
  }

  /**
   * Get the description for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return array
   */
  getDescription(character) {
    if (character.pet.type === 'equipment-pets-000_no_pet') {
      if (character.inventory.has('quest-pet_collar')) {
        return __('Karl, the proprietor, approaches you holding an adorable kitten. "Oh, I see you\'ve found Honey\'s collar!  I tell you what, you\'ve proven to be such an animal lover that I\'ll give you a cat for free!');
      }
      else {
        return __('Karl, the proprietor, approaches you holding an adorable kitten. "We\'ve got a few cats ready for adoption today," he says. "Or, if you want to pick up an old pet you\'ve stabled, we\'re connected to the stable network, so you can access your entire stable of pets."')
          + __('\n\n"Oh," he continues.  "Could you keep an eye out for little Honey\'s collar out there?  I lost it in the cave in the forest, and I can make it worth your while if you find it."');
      }
    }

    return __('Karl, the proprietor, approaches you holding an adorable kitten. "We\'ve got a few cats ready for adoption today," he says. "Or, if you want to pick up an old pet you\'ve stabled, we\'re connected to the stable network, so you can access your entire stable of pets."');
  }
}

module.exports = Pets;