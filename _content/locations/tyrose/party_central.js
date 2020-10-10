"use strict";

const Location = require('@app/content/locations').Location;
const Text     = require('@util/text');

/**
 * The Party Central location in the city of Tyrose.
 */
class PartyCentralLocation extends Location {
  constructor() {
    super({
      type: 'tyrose-party_central',
      displayName: "Party Central",
      buttonText: "Party Central",
      description: "A small band plays merry music to the side of a well-decorated counter, behind which stands a colourfully-dressed man, a-rockin' to the beat.\n\nArtfully arranged in a case to his side is a selection of magical scrolls containing *powerful boosts* that help out your entire party at once!",
      image: 'encounters/party_master.png',
      connectedLocations: [
        'tyrose',
      ],
      shopItems: {
        'premium': {
          shopText: 'Party Boosts',
          style: 'primary',
          items: [
            'boost-party-max_ap',
            'boost-party-1_sp',
          ],
        },
      }
    });
  }

  /**
   * Get any extra description for the shop type the user is looking at.
   *
   * @param {Character} character - The character doing the shopping.
   * @param {string} shopType - The type of shop the character is shopping at.
   *
   * @return {string}
   */
  getShopDescription(character, shopType) {
    let description = '';

    if ('premium' === shopType) {
      description = "\n\n*\"Generosity is always a good look,\"* he says.  \"If you have any _Dragon Scales,_ you can pick up some boosts that will affect your whole party.  And if you're low on _Dragon Scales_, you can grab some over here:\"\n\n" + Text.getBuyUrl(character);
    }

    return description + super.getShopDescription(character, shopType);
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
    actions = super.addMiscActions(character, actions);

    actions.addButton("Party Master", "start_encounter", { params: { type: 'party_master' } });

    return actions;
  }
}

module.exports = PartyCentralLocation;