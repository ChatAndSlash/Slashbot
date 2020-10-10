"use strict";

const Command     = require('@app/content/commands').Command;
const Combat      = require('@app/combat');
const Consumable  = require('@app/content/items/consumable').Consumable;
const Spells      = require('@app/content/spells').Spells;
const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;

const COLORS        = require('@constants').COLORS;
const FIGHT_ACTIONS = require('@constants').FIGHT_ACTIONS;
const PROPERTIES    = require('@constants').PROPERTIES;
const FLAGS         = require('@constants').FLAGS;

/**
 * Perform an action while in a fight.
 */
class FightActionCommand extends Command {
  /**
   * Determine what fight action to take.
   */
  async execute() {
    const character = this.character;

    if ('items' === this.info.action) {
      if (character.stamina === 0) {
        await this.updateLast({
          attachments: Attachments.one({ title: __(":warning: You require Stamina to use items."), color: COLORS.WARNING }),
          doLook: true
        });
      }
      else {
        await this.showItemActions();
      }
    }
    else if ('cast' === this.info.action && _.isUndefined(this.info.spell)) {
      if (character.stamina === 0) {
        await this.updateLast({
          attachments: Attachments.one({ title: __(":warning: You require Stamina to cast spells."), color: COLORS.WARNING }),
          doLook: true
        });
      }
      else if (character.hasFlag(FLAGS.CANNOT_CAST)) {
        await this.updateLast({
          attachments: Attachments.one({ title: __(":zipper_mouth_face: You cannot cast spells here."), color: COLORS.WARNING }),
          doLook: true
        });
      }
      else {
        await this.showSpellActions();
      }
    }
    // Otherwise, a definitive action has been chosen
    else {
      await this.doAction();
    }
  }

  /**
   * Update original message with item buttons.
   */
  async showItemActions() {
    const character = this.character;
    let options = new Options();

    for (let consumable of character.inventory.listByClass(Consumable)) {
      if (consumable.canBeUsed(character)) {
        options.add(
          `${consumable.getDisplayName(character)} x${consumable.quantity}`,
          { action: "item", item: consumable.type }
        );
      }
    }

    let attachments = new Attachments().add({
      title: options.length ? __('What item do you want to use?') : __("You have no items you can use at this time."),
      fields: this.character.getFields(),
      color: COLORS.INFO
    });

    if (options.length) {
      attachments.addSelect(__("Items"), "fight_action", options.getCollection());
      attachments.addButton(__("Cancel"), "look");
    }
    else {
      attachments.addButton(__("Okay"), "look");
    }

    await this.updateLast({ attachments });
  }

  /**
   * Update the original message with buttons for spells this character has.
   */
  async showSpellActions() {
    const character = this.character;
    let attachments = new Attachments().add({
      title: __('What spell do you want to cast?'),
      fields: this.character.getFields(),
      color: COLORS.INFO
    });
    let options = new Options();

    for (let spellType of character.knownSpells) {
      const spell = Spells.new(spellType);
      const canCastText = (character.mp < spell.getMpCost(character)) ? '✗' : '✓';
      options.add(
        `${spell.getDisplayName(character)}  (${spell.getMpCost(character)}MP ${canCastText})`,
        { action: "cast", spell: spellType }
      );
    }

    attachments.addSelect(__("Spells"), "fight_action", options.getCollection());
    attachments.addButton(__("Cancel"), "look");

    await this.updateLast({ attachments });
  }

  /**
   * Perform the selected fight action.
   */
  async doAction() {
    const character = this.character;
    const info      = this.info;

    if (character.canDoAction(info)) {
      // If action is a skill that has sub-actions
      if (FIGHT_ACTIONS.SKILL === info.action) {
        const skill = character.profession.getSkills(character)[info.skill];
        if (skill.properties.includes(PROPERTIES.HAS_SUB_ACTIONS)) {
          const attachments = character.profession.doSkill(character, info.skill);
          return await this.updateLast({ attachments });
        }
      }

      // Normal skill?  Just get 'er done
      await this.updateLast({
        attachments: Attachments.one({ title: __(":white_check_mark: Got it!") }),
      });
      Combat.fight(info, character);
    }
    else {
      if (FIGHT_ACTIONS.CAST === info.action) {
        await this.updateLast({
          attachments: Attachments.one({
            title: character.spellCastErrorText(info.spell),
            color: COLORS.WARNING,
          }),
          doLook: true
        });
      }
      else if (FIGHT_ACTIONS.DEFEND === info.action) {
        await this.updateLast({
          attachments: Attachments.one({
            title: __("You can't defend when you're dazed."),
            color: COLORS.WARNING,
          }),
          doLook: true
        });
      }
      else if (FIGHT_ACTIONS.ENEMY_ACTION === info.action) {
        await this.updateLast({
          attachments: Attachments.one({
            title: character.enemy.getCharacterFightActionError(character, info.type),
            color: COLORS.WARNING,
          }),
          doLook: true
        });
      }
      else {
        await this.updateLast({
          attachments: Attachments.one({
            title: character.profession.getSkillErrorMessage(this.character, info.skill),
            color: COLORS.WARNING,
          }),
          doLook: true
        });
      }
    }
  }
}

module.exports = FightActionCommand;