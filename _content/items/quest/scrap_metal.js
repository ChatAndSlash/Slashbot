"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class ScrapMetal extends QuestItem {
  constructor() {
    super({
      type: 'quest-scrap_metal',
      displayName: __('Scrap Metal'),
      description: __("A chunk of cast-aside metal that's still good, but wasn't good enough to make the cut when the mine was still operating.  Can be used to rebuild the facilities at the Scatterslide Mining Camp."),
      maxQuantity: 75,
    });
  }
}

module.exports = ScrapMetal;