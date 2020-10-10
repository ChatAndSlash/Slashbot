"use strict";

const Axes = require('@app/content/items/equipment/weapons/axes');

class BlacksteelBattleaxeWeapon extends Axes {
  constructor() {
    super({
      type: 'equipment-weapons-axes-050_blacksteel_battleaxe',
      displayName: __('Blacksteel Battleaxe'),
      description: __("Made from deep, dark, hard, sharp blacksteel, this axe seems to absorb all light and is exceedingly dangerous.  For your opponents, anyway."),
      level: 50,
      minDamage: 60,
      maxDamage: 100,
      crit: 5,
      gold: 7000,
    });
  }
}

module.exports = BlacksteelBattleaxeWeapon;