"use strict";

const Relic = require('@app/content/items/equipment/relics');

class ShellWandRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-003_shell_wand',
      displayName: __('Shell Wand'),
      description: __('Similar to the simple wand, but with tiny shells glued to it?'),
      spellPower: 3,
      level: 3,
      gold: 50,
    });
  }
}

module.exports = ShellWandRelic;