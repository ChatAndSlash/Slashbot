"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class ShadowSoulGemQuestItem extends QuestItem {
  constructor() {
    super({
      type: 'quest-watermoon-shadow_soul_gem',
      displayName: __('Shadow Soul Gem'),
      description: __("In this perfectly-cut grey gem, a powerful soul can be seen swirling about."),
      maxQuantity: 1,
    });
  }
}

module.exports = ShadowSoulGemQuestItem;