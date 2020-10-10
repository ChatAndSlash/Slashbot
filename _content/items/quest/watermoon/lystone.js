"use strict";

const { toWords } = require('number-to-words');
const QuestItem = require('@app/content/items/quest').QuestItem;

const { LYSTONE_CHIP_MAX } = require('@constants');

class LystoneQuestItem extends QuestItem {
  constructor() {
    super({
      type: 'quest-watermoon-lystone',
      displayName: "Lystone",
      description: "A dull green stone with nine distinct chips missing.",
      maxQuantity: 1,
    });
  }

  /**
   * Get the description of this item.
   *
   * @param {Character} character - The character getting the description of this item
   *
   * @return {string}
   */
  getDescription(character) {
    const chipCount = character.location.getLystoneChipCount(character);

    if (chipCount === LYSTONE_CHIP_MAX) {
      return __("A brightly-glowing green stone, pulsing with energy and potential.");
    }
    else if (chipCount === 0) {
      return __("A dull green stone with nine distinct chips missing.");
    }

    return __("A faintly-glowing green stone with %s distinct chips missing.", toWords(LYSTONE_CHIP_MAX - chipCount));
  }
}

module.exports = LystoneQuestItem;