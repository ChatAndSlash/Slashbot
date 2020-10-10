"use strict";

const QuestItem = require('@app/content/items/quest').QuestItem;

class ClueQuestItem extends QuestItem {
  constructor() {
    super({
      type: 'quest-watermoon-clue',
      displayName: __('Clue'),
      description: __("This scrap of paper seems innocuous, but contains mysteries to help the intrepid explorer tame the terrifying Labyrinth."),
    });
  }
}

module.exports = ClueQuestItem;