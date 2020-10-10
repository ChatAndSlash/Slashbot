"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class IntactGear extends QuestItem {
  constructor() {
    super({
      type: 'quest-intact_gear',
      displayName: __('Intact Gear'),
      description: __("A tiny brass gear which, unlike all the other trashed machinery around here, has all its teeth intact and can be used to repair machinery."),
      maxQuantity: 25,
    });
  }
}

module.exports = IntactGear;