"use strict";

const Command     = require('@app/content/commands').Command;
const Items       = require('@app/content/items').Items;
const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;

const STATS  = require('@constants').STATS;
const COLORS = require('@constants').COLORS;

const COMMAND_NAME = "sell";
const ACTION_SELL = "sell";

/**
 * Sell some equipment!
 */
class SellCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === ACTION_SELL) {
      await this.sell();
    }
    else {
      await this.showList();
    }
  }

  /**
   * Show the list of equipment that can be sold.
   */
  async showList() {
    const character = this.character;

    let attachments = new Attachments().add({
      title: __("What equipment did you want to sell?"),
      fields: character.getFields(),
      color: COLORS.INFO
    });

    let options = new Options();

    for (const item of character.equipment.list()) {
      options.add(
        `${item.getDisplayName(character)}: ${item.getSellPriceDescription(character)}`,
        { action: ACTION_SELL, item: item.type }
      );
    }

    attachments.addSelect(__("Sell"), COMMAND_NAME, options.getCollection());
    attachments.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({ attachments });
  }

  /**
   * Sell a piece of equipment
   */
  async sell() {
    const character = this.character;
    const item = Items.new(this.info.item);
    let goldWarningText = "";

    if (item.willExceedMaxGold(character)) {
      goldWarningText = __("  You've reached your maximum gold!  Maybe visit the Exchange and pick up some Alchemy Catalysts for some enhancement flasks?");
    }
    else if (item.willApproachMaxGold(character)) {
      goldWarningText = __("  You're nearing your maximum gold!  Maybe visit the Exchange and pick up some Alchemy Catalysts for some enhancement flasks?");
    }

    item.addSellPriceTo(character);
    character.equipment.remove(item.type, item.equipType);
    character.increaseStat(STATS.EQUIPMENT_SOLD, 1, item.equipType);

    const title = __(
      "You sell your old %s and collect %s in payment.%s",
      item.getDisplayName(character),
      item.getSellPriceDescription(character),
      goldWarningText
    );

    await this.updateLast({
      attachments: Attachments.one({ title, color: COLORS.GOOD }),
      fields: [],
      doLook: true
    });
  }
}

module.exports = SellCommand;