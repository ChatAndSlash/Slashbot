"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME = 'forest-trainer';
const ACTION_LEARN   = 'learn';

/**
 * Encounter the Trainer in the forest.
 */
class TrainerEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("trainer dialoge, display fierce information in ```these things``` and display the SP info underneath like in the train command."),
      actions: Actions.oneButton(__('Learn Fierce'), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEARN } } )
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
    return 'encounters/tyrose/trainer.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Trainer");
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    const skill = character.profession.getSkills(character).fierce;
    const name = skill.name;
    const cost = `${skill.spCost} SP`;
    const req = __("%d required", skill.reqSp);
    const skillDescription = skill.description;

    return __("You come across a man sitting on a log, his eyes closed, his breathing regular.  Sensing your presence, he nods at you, never opening his eyes.\n\n\"Dangerous out here,\" he says.  \"If you're not careful, you could run into trouble you find you can't handle.  Furious creatures and the like.  But if you have a moment, I could give you a little lesson in how to deal with that situation.  Just sit a while with me and study.\"```\n- %s: [%s, %s] %s```\nYou have *%d* SP available and have spent *%d* SP in this profession.", name, cost, req, skillDescription, 5, 0);
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    const profession = character.profession;

    let title = '';

    if (ACTION_LEARN === action) {
      title = __(":mortar_board: You spend %d SP and learn the %s skill!\n\n\"Wow, you're a quick study,\" he exclaims.  \"If, and well, WHEN you need further training, come find me in the town square.  You still have a lot to learn.\"", 5, __("Fierce"));
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    profession.trained.fierce = true;

    profession.sp      -= 5;
    profession.spSpent += 5;

    character.track('Train Skill', { skill_type: 'fierce' });

    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = TrainerEncounter;