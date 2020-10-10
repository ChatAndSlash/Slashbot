"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class SpikedMorningstar extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-015_spiked_morningstar',
      displayName: __('Spiked Morningstar'),
      description: __('Less of a "Spiked Ball On A Chain On A Stick" morningstar than a "Spiked Ball Attached Directly To The Stick" one, this vicious-looking weapon will still do plenty of damage when swung in anger.'),
      level: 15,
      minDamage: 25,
      maxDamage: 30,
      gold: 750,
    });
  }
}

module.exports = SpikedMorningstar;