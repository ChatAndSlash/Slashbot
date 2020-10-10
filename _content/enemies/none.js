"use strict";

const Enemy = require('@app/content/enemies').Enemy;

class None extends Enemy {
  constructor() {
    super({
      type: 'none',
      displayName: 'None',
      description: '',
      stats: {
        base: {
          maxHp: 0,
          force: 0,
          crit: 0,
          defence: 0,
          dodge: 0,
          goldMin: 0,
          goldMax: 0
        },
        perLevel: {
          maxHp: 0,
          force: 0,
          crit: 0,
          defence: 0,
          dodge: 0,
          goldMin: 0,
          goldMax: 0
        }
      },
    });
  }
}

module.exports = None;