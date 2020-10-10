"use strict";

const CrierMessages                = require('@app/crierMessages');
const { isHalloween, isChristmas } = require('@util/events');

/**
 * Locations where a Town Crier hangs out.
 *
 * @return {Mixin}
 */
const CrierLocation = () => {
  return (Location) => class extends Location {
    /**
     * Load any extra information required to display this location.
     *
     * @param {Character} character - The character to load extra information for.
     */
    async loadExtra(character) {
      await super.loadExtra(character);

      this.messages = (await CrierMessages.load(character.connection));
    }

    /**
     * Get the Towne Crier text to add to this location's description.
     */
    getCrierText(character) {
      let text = "\n\n*The Towne Crier stands nearby, barking out messages left by passers-by:*\n";

      for (let i = 2; i >= 0; i--) {
        text += `> "${this.messages[i].text}" - ${this.messages[i].name}\n`;
      }

      if (isHalloween()) {
        text += "\n> \"*Hear ye, hear ye!  A terrifying Spirit Dragon is haunting the lands, and the Mysterious Merchant returns, bearing new and fantastic items!*\"\n";
      }
      else if (isChristmas()) {
        text += "\n> \"*Hear ye, hear ye!  Adorable Golden Drakes have come bearing presents, and the Mysterious Merchant returns, bearing new and fantastic items!*\"\n";
      }

      return text;
    }

    /**
     * Add the button to visit the Towne Crier.
     *
     * @param {Actions} actions - The actions to add the Crier button to.
     *
     * @return {Actions}
     */
    addCrierButton(actions) {
      actions.addButton("Towne Crier", "start_encounter", { params: { type: 'towne_crier' } });

      return actions;
    }
  };
};

module.exports = {
  CrierLocation
};