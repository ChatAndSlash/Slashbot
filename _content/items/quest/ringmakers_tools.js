"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class RingmakersTools extends QuestItem {
  constructor() {
    super({
      type: 'quest-ringmakers_tools',
      displayName: __('Ringmaker\'s Tools'),
      description: __("A bag of sizers, clamps, benders, and cutters, such as a ringmaker might use."),
    });
  }
}

module.exports = RingmakersTools;