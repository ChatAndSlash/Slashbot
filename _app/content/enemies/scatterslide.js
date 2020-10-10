"use strict";

const Enemy = require("@app/content/enemies").Enemy;

/**
 * Scatterslide enemies parent class.
 */
class ScatterslideEnemy extends Enemy {
  constructor(info) {
    super(info);

    this.stats.base.defence     = _.get(info, 'stats.base.defence', 3);
    this.stats.perLevel.defence = _.get(info, 'stats.perLevel.defence', 1.5);
  }
}

module.exports = {
  ScatterslideEnemy
};