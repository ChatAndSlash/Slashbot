"use strict";

const Gun = require('@app/content/items/equipment/weapons/guns');

class TrainingPistol extends Gun {
  constructor() {
    super({
      type: 'equipment-weapons-guns-020_training_pistol',
      displayName: __("Training Pistol"),
      description: __("Your very first gun!  Easy-to-use, though not terribly effective.."),
      level: 20,
      minDamage: 15,
      maxDamage: 19,

      minAttacks: 1,
      maxAttacks: 3,
      maxAmmo: 7,

      gold: 1250,
    });
  }
}

module.exports = TrainingPistol;