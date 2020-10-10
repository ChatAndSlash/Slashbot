"use strict";

const Command     = require('@app/content/commands').Command;
const Spells      = require('@app/content/spells').Spells;
const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;
const STD_DELAY       = require('@constants').STD_DELAY;

const ACTION_CAST = "cast";

/**
 * Cast a spell!
 */
class CastCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;

    if (CHARACTER_STATE.FIGHTING === character.state) {
      character.slashbot.say(
        ":warning: Use the \"Cast\" button to cast magic in combat.",
        character
      );
      await this.doLook();
    }
    else {
      if (_.isUndefined(this.info.action)) {
        character.slashbot.say(" ", character, {
          attachments: this.getSpellActions(character)
        });
      }
      else if (ACTION_CAST === this.info.action) {
        if (character.canCastSpell(this.info.spell)) {
          const spell = this.getSpell(this.info.spell);

          await this.updateLast({
            attachments: Attachments.one({
              title: this.castSpell(spell, character),
            }),
          });

          if (spell.redisplaySpellMenu) {
            character.slashbot.say(" ", character, {
              attachments: this.getSpellActions(character),
              messageDelay: STD_DELAY
            });
          }
        }
        else {
          await this.saySpellError(character, this.info.spell);
        }
      }
      else {
        throw new Error(`Invalid action '${this.info.action}'.`);
      }
    }
  }

  /**
   * Get the spell being cast.
   *
   * @param {string} spell - The spell to cast.
   *
   * @return {Spell}
   */
  getSpell(spell) {
    return Spells.new(spell);
  }

  /**
   * Cast the chosen spell.
   *
   * @param {Spell} spell - The spell to cast.
   * @param {Character} character - The character casting the spell.
   */
  castSpell(spell, character) {
    return spell.cast(character, character.slashbot);
  }

  /**
   * Get the actions for the spell list.
   *
   * @param {Character} character - The character to show spell actions for.
   *
   * @return {Attachments}
   */
  getSpellActions(character) {
    let attachments = new Attachments().add({
      title: "What spell do you want to cast?",
      fields: this.character.getFields(),
      color: COLORS.INFO
    });
    let options = new Options();

    for (let spellType of character.knownSpells) {
      const spell = this.getSpell(spellType);
      const canCastText = (character.mp < spell.getMpCost(character)) ? '✗' : '✓';
      options.add(
        `${spell.getDisplayName(character)}  (${spell.getMpCost(character)}MP ${canCastText})`,
        { action: ACTION_CAST, spell: spellType }
      );
    }

    const buttonText = CHARACTER_STATE.FIGHTING === character.state ? "Cancel" : "Done";
    attachments.addSelect("Spells", ACTION_CAST, options.getCollection());
    attachments.addButton(buttonText, "look");

    return attachments;
  }

  /**
   * Spit out an error that occured when trying to cast a spell.
   *
   * @param {Character} character - The character attempting to cast the spell.
   * @param {string} spell - The type of the spell.
   */
  async saySpellError(character, spell) {
    character.slashbot.say(character.spellCastErrorText(spell), character);
    await this.doLook();
  }
}

module.exports = CastCommand;