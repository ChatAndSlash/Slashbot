"use strict";

const Command     = require('@app/content/commands').Command;
const Items       = require('@app/content/items').Items;
const Attachments = require('slacksimple').Attachments;

const COLORS = require('@constants').COLORS;

/**
 * Examine an item.
 */
class ExamineCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const text      = this.info.text;

    // If empty, don't try to look it up
    if (_.trim(text).length === 0) {
      character.slashbot.say("*Examine what?*", character);
      return await this.doLook();
    }

    try {
      const itemType = Items.getType(text);
      const item = Items.new(itemType);
      item.quantity = this.getItemQuantity(character, itemType);

      if (item.quantity === 0) {
        character.slashbot.say("*You don't own any of those.*", character);
      }
      else {
        character.slashbot.say(
          `*${item.getDisplayName(character)}:*`,
          character,
          {
            attachments: Attachments.one({
              text: item.getDescription(character),
              color: COLORS.INFO,
              fields: item.getExamineFields(character),
            })
          }
        );
      }
    }
    catch (e) {
      character.slashbot.say(__("*I really don't know what a \"%s\" is.*", text), character);
    }

    await this.doLook();
  }

  /**
   * Get the quantity of an item a character has.  Can be items or equipment.
   *
   * @param {Character} character - The character to get the quantity from.
   * @param {string} itemType - The type of the item to get the quantity for.
   *
   * @return {integer}
   */
  getItemQuantity(character, itemType) {
    if (character.inventory.has(itemType)) {
      return character.inventory.quantity(itemType);
    }

    if (character.weapon.type === itemType) {
      return 1;
    }

    if (character.relic.type === itemType) {
      return 1;
    }

    if (character.armour.type === itemType) {
      return 1;
    }

    if (character.accessory.type === itemType) {
      return 1;
    }

    if (character.pet.type === itemType) {
      return 1;
    }

    for (const item of character.equipment.list()) {
      if (item.type === itemType) {
        return 1;
      }
    }

    return 0;
  }
}

module.exports = ExamineCommand;