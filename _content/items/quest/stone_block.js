"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class StoneBlock extends QuestItem {
  constructor() {
    super({
      type: 'quest-stone_block',
      displayName: __('Stone Block'),
      description: __("A solid and well-cut block of stone.  Can be used to rebuild the facilities at the Scatterslide Mining Camp."),
      maxQuantity: 75,
    });
  }
}

module.exports = StoneBlock;