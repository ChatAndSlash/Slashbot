"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class CrudeExplosive extends QuestItem {
  constructor() {
    super({
      type: 'quest-crude_explosive',
      displayName: __('Crude Explosive'),
      description: __("Loosely-packed black powder and a shoddy fuse.  This could actually be dangerous if gathered together in a lage enough bundle."),
      maxQuantity: 35,
    });
  }
}

module.exports = CrudeExplosive;