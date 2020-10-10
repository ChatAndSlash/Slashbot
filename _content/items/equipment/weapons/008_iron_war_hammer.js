"use strict";

const Weapon = require('@app/content/items/equipment/weapons');

class IronWarHammer extends Weapon {
  constructor() {
    super({
      type: 'equipment-weapons-008_iron_war_hammer',
      displayName: __('Iron War Hammer'),
      description: __('This hammer is made of simple pig iron, but is heavy enough to do serious damage if swung by a serious warrior, like yourself.'),
      level: 8,
      minDamage: 15,
      maxDamage: 22,
      gold: 200,
    });
  }
}

module.exports = IronWarHammer;