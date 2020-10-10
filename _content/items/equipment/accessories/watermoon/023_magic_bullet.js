"use strict";

const Accessory = require('@app/content/items/equipment/accessories');

class MagicBulletAccessory extends Accessory {
  constructor() {
    super({
      type: 'equipment-accessories-watermoon-023_magic_bullet',
      displayName: __('Magic Bullet'),
      description: __('A tiny, softly-glowing bullet that seems to fit any gun.'),
      maxAmmo: 1,
      level: 23,
      gold: 750,
    });
  }
}

module.exports = MagicBulletAccessory;