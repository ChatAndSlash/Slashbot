"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STD_DELAY       = require('@constants').STD_DELAY;

const ENCOUNTER_NAME   = "scatterslide-goblin_child";
const ACTION_KILL_IT   = "kill_it";
const ACTION_WALK_AWAY = "walk_away";

/**
 * Encounter an injured goblin child.
 */
class GoblinChildEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Kill it"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_KILL_IT } });
    actions.addButton(__("Walk away"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_WALK_AWAY } });

    super({
      type: ENCOUNTER_NAME,
      description: __("Hiding behind a pile of rubble is a whimpering goblin child.  As you approach, it limps backwards, clearly favouring an injured leg.  You consider this situation.  Left alone, this goblin will eventually grow up into an enemy who will harass and potentially harm the miners and travelling caravans."),
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
    return 'encounters/scatterslide/goblin_child.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Goblin Child");
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

    if (ACTION_KILL_IT === action) {
      title = __("You monster.");
    }
    else if (ACTION_WALK_AWAY === action) {
      title = __("You walk away, shaking your head.  You hear the child's whimpering fade behind you.");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.increaseStat(STATS.GOBLIN_CHILD, 1, action);
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
    if ("cure" === spell.type) {
      character.increaseStat(STATS.GOBLIN_CHILD, 1, "cure");
      character.state = CHARACTER_STATE.IDLE;

      character.slashbot.say(__("*You approach the child slowly, with your hands up and empty.  The child cries, but doesn't move away.  You gather your will, and direct a surge of magic through the child's body, mending its injured limb.  Amazed, it looks up at you gratefully, then runs off.*\n\n*You're not sure what you accomplished today, but you feel good about yourself.*"), character);
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
    }
    else {
      super.castSpell(spell, character);
    }
  }
}

module.exports = GoblinChildEncounter;