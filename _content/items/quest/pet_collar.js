"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class PetCollar extends QuestItem {
  constructor() {
    super({
      type: 'quest-pet_collar',
      displayName: __('Pet Collar'),
      description: __('A collar with the name "Honey" inscribed on it.'),
    });
  }
}

module.exports = PetCollar;