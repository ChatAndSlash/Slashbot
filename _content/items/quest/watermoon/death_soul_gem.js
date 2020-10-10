"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class DeathSoulGemQuestItem extends QuestItem {
  constructor() {
    super({
      type: 'quest-watermoon-death_soul_gem',
      displayName: __('Death Soul Gem'),
      description: __("In this perfectly-cut black gem, a powerful soul can be seen swirling about."),
      maxQuantity: 1,
    });
  }
}

module.exports = DeathSoulGemQuestItem;