"use strict";

const { mix }       = require('mixwith');
const Pet           = require('@app/content/items/equipment/pets');
const { ScaleCost } = require('@mixins/item/scale_cost');

class Aisling extends mix(Pet).with(ScaleCost(75)) {
  constructor() {
    super({
      type: 'equipment-pets-aisling',
      displayName: __('Aisling'),
      shopText: __('A tame Spirit Drake that will consume gold dropped in combat, but grant +1 SP.'),
      description: __('This adorable and ghostly little drake happily follows her owner about, chirping sweetly and honking pleasantly.'),
    });
  }

  /**
   * Perform any post-fight success actions and return the messages arising from them.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    messages = super.doFightSuccess(character, messages);

    messages.push(":thinking_face: Aisling beats you to the gold and scarfs it down, it disappearing somewhere into the aether inside of her.  A little wiser, you gain +1 SP.");

    return messages;
  }
}

module.exports = Aisling;