"use strict";

const Enemy = require("@app/content/enemies").Enemy;

/**
 * Watermoon enemies parent class.
 */
class WatermoonEnemy extends Enemy {
  constructor(info) {
    super(info);

    this.stats.base.minDamage = _.get(info, 'stats.base.minDamage', 3);
    this.stats.base.maxDamage = _.get(info, 'stats.base.maxDamage', 5);
    this.stats.base.force     = _.get(info, 'stats.base.force', 5);
    this.stats.base.defence   = _.get(info, 'stats.base.defence', 5);

    this.stats.perLevel.maxHp     = _.get(info, 'stats.perLevel.maxHp', 30);
    this.stats.perLevel.minDamage = _.get(info, 'stats.perLevel.minDamage', 1.4);
    this.stats.perLevel.maxDamage = _.get(info, 'stats.perLevel.maxDamage', 1.4);
    this.stats.perLevel.force     = _.get(info, 'stats.perLevel.force', 1.8);
    this.stats.perLevel.defence   = _.get(info, 'stats.perLevel.defence', 1.8);
    this.stats.perLevel.goldMin   = _.get(info, 'stats.perLevel.goldMin', 3);
    this.stats.perLevel.goldMax   = _.get(info, 'stats.perLevel.goldMax', 4);
  }
}

module.exports = {
  WatermoonEnemy
};