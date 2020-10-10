"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class EssenceCrystalQuestItem extends QuestItem {
  constructor() {
    super({
      type: 'quest-watermoon-essence_crystal',
      displayName: __('Essence Crystal'),
      description: __("This small, glittering crystal contains a swirling energy inside that can be used to power the planar portals in the Mystic District."),
    });
  }
}

module.exports = EssenceCrystalQuestItem;