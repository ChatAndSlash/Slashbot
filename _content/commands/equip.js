"use strict";

const Command     = require('@app/content/commands').Command;
const Combat      = require('@app/combat');
const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;
const Items       = require('@app/content/items').Items;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;

const ACTION_EQUIP = 'equip';

/**
 * Equip a new piece of equipment.
 */
class EquipCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;

    if (character.equipment.list().length === 0) {
      character.slashbot.say(":warning: You are not carrying any extra equipment.", character);
    }
    else {
      if (_.isUndefined(this.info.action)) {
        this.showEquipment(character);
      }
      else if (ACTION_EQUIP === this.info.action) {
        await this.equip(this.info.item, character);
      }
      else {
        throw new Error(`Invalid action '${this.info.action}'.`);
      }
    }
  }

  /**
   * Attempt to equip the selected item.
   *
   * @param {string} type - The type of item to equip.
   * @param {Character} character - The character equipping the item.
   */
  async equip(type, character) {
    const item = Items.new(type);
    if ( ! item) {
      throw new Error(`Invalid item type: '${type}'.`);
    }

    if (CHARACTER_STATE.FIGHTING === character.state) {
      const info = { action: ACTION_EQUIP, item };

      if (character.canDoAction(info)) {
        Combat.fight(info, character);
      }
      else {
        await this.updateLast({
          attachments: Attachments.one({
            title: __("You can't equip %s now.", item.getDisplayName()),
            color: COLORS.WARNING
          }),
          doLook: true,
        });
      }
    }
    else {
      await this.updateLast({
        attachments: Attachments.one({
          title: character.equipment.equip(character, item)[0],
          color: COLORS.GOOD
        }),
        doLook: true,
      });
    }
  }

  /**
   * Update the original message with a dropdown for equipment this character has.
   *
   * @param {Character} character - The character to show spell actions for.
   */
  showEquipment(character) {
    let attachments = new Attachments().add({
      title: __('What equipment do you want to equip?'),
      fields: this.character.getFields(),
      color: COLORS.INFO
    });
    let options = new Options();

    for (const item of character.equipment.list()) {
      options.add(
        item.getDisplayName(character),
        { action: ACTION_EQUIP, item: item.type }
      );
    }

    attachments.addSelect(__("Equipment"), ACTION_EQUIP, options.getCollection());
    attachments.addButton(__("Cancel"), "look");

    character.slashbot.say(" ", character, { attachments });
  }
}

module.exports = EquipCommand;