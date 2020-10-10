"use strict";

const Relic = require('@app/content/items/equipment/relics');

class BoneRitualKnifeRelic extends Relic {
  constructor() {
    super({
      type: 'equipment-relics-021_bone_ritual_knife',
      displayName: __('Bone Ritual Knife'),
      description: __("While dull and ineffective for combat, this knife is a rare tool for harnessing and directing magical energies."),
      level: 21,
      spellPower: 49,
      gold: 1500,
    });
  }
}

module.exports = BoneRitualKnifeRelic;