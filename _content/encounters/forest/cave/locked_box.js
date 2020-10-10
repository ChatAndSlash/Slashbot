"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STD_DELAY       = require('@constants').STD_DELAY;

const ENCOUNTER_NAME = "forest-cave-locked_box";
const ACTION_OPEN    = "open";
const ACTION_LEAVE   = "leave";

const GOLD_REWARD = 15;

/**
 * Encounter a locked and trapped box.
 */
class LockedBoxEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Smash it"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_OPEN } });
    actions.addButton(__("Leave"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE } });

    super({
      type: ENCOUNTER_NAME,
      description: __("You nearly trip over something as you walk through the cave.  You lean down to examine it, and find a small wooden box.  The box has the name \"Eddie\" scratched onto it in a childlike scrawl, and a thick lock to which you have no key.  Thankfully, the box is flimsy enough that you feel you could break it open."),
      title: __("What's in the booox?"),
      actions
    });
  }

  /**
   * Get the image for this encounter.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/tyrose/locked_box.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Locked Box");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let title = '';

    if (ACTION_OPEN === action) {
      // Do 10 damage, but leave at least 1 HP
      const damage = character.hp > 10 ? 10 : character.hp - 1;
      character.decreaseHp(damage);

      character.gold += GOLD_REWARD;

      title = __("You smash the box, which also smashes a glass vial inside the box.  A choking cloud issues forth, searing your lungs for %d damage.  On the plus side, you find %d gold inside the box, so uh, yay?", damage, GOLD_REWARD);
    }
    else if (ACTION_LEAVE === action) {
      title = __("You leave the box behind undisturbed.");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.setStat(STATS.CAVE_LOCKED_BOX);
    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Cast a spell that may affect this encounter.
   *
   * @param {Spell} spell - The spell being cast.
   * @param {Character} character - The character casting the spell.
   */
  castSpell(spell, character) {
    if ("scry" === spell.type) {
      character.setStat(STATS.CAVE_LOCKED_BOX);
      character.state = CHARACTER_STATE.IDLE;

      character.gold += GOLD_REWARD;

      character.slashbot.say(__("*You concentrate on the future, and receive a vision of yourself being poisoned by a glass vial you accidentally break when you carelessly smash open this box.  Carefully, you break the part of the box that doesn't have the glass vial in it, and retrieve %d gold without injuring yourself.*", GOLD_REWARD), character);
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
    }
    else {
      super.castSpell(spell, character);
    }
  }
}

module.exports = LockedBoxEncounter;