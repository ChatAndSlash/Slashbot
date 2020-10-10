"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class AngledFaceripperWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-043_angled_faceripper',
      displayName: __('Angled Faceripper'),
      description: __("The haft of this axe is angled slightly forwards, while the blade has the occasional hook, useful for... ripping off faces.  An odd weapon."),
      level: 43,
      minDamage: 46,
      maxDamage: 80,
      crit: 5,
      gold: 5500,
    });
  }
}

module.exports = AngledFaceripperWeapon;