"use strict";

const Item = require("@app/content/items").Item;

/**
 * Quest item parent class.
 */
class QuestItem extends Item {
  constructor(info) {
    super({
      ...info,
      shouldBold: true,
    });
  }
}

module.exports = {
  QuestItem
};
