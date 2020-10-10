"use strict";

const ToolItem = require('@app/content/items/tool').ToolItem;

class LabyrinthKeyTool extends ToolItem {
  constructor() {
    super({
      type: 'tool-labyrinth_key',
      displayName: __('Labyrinth Key'),
      description: __("A large key with what looks like a glyph of a monster's head on the bow."),
    });
  }
}

module.exports = LabyrinthKeyTool;