"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class FaithSoulGemQuestItem extends QuestItem {
  constructor() {
    super({
      type: 'quest-watermoon-faith_soul_gem',
      displayName: __('Faith Soul Gem'),
      description: __("In this perfectly-cut purple gem, a powerful soul can be seen swirling about."),
      maxQuantity: 1,
    });
  }
}

module.exports = FaithSoulGemQuestItem;