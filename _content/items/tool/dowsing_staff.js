"use strict";

const ToolItem = require('@app/content/items/tool').ToolItem;

class DowsingStaff extends ToolItem {
  constructor() {
    super({
      type: 'tool-dowsing_staff',
      displayName: __('Dowsing Staff'),
      description: __('A long, thin staff that can be used to identify strong sources of planar energy.'),
    });
  }
}

module.exports = DowsingStaff;