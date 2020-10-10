"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class ChunkyKey extends QuestItem {
  constructor() {
    super({
      type: 'quest-chunky_key',
      displayName: __('Chunky Key'),
      description: __("This heavy key has a complex collections of teeth and looks like it is designed to be used on a very large lock."),
      maxQuantity: 20,
    });
  }
}

module.exports = ChunkyKey;