"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME = "forest-bandit_clearing";
const ACTION_LISTEN  = "listen";
const ACTION_LEAVE   = "leave";

/**
 * Encounter a bunch of bandits in a clearing.
 */
class BanditClearingEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Listen quietly"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LISTEN } });
    actions.addButton(__("Leave"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE } });

    super({
      type: ENCOUNTER_NAME,
      description: __("As you walk through the forest, you hear a bunch of rowdy voices coming from a clearing ahead of you.  Not certain of their intentions, you close the distance quietly and see a group dressed in shabby clothing crowded around a meagre campfire.  From the brief snippets of conversation you catch, you can tell that it's a group of bandits grousing about... something."),
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
    return 'encounters/tyrose/bandit_clearing.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Bandit Clearing");
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

    if (ACTION_LISTEN === action) {
      character.slashbot.tellStory([
        __("You creep closer and huddle behind a rock near the campfire.  From this distance, you can hear their words clearly."),
        __("These bandits have no end of harsh words for the *Green Dragon* which has taken over their nearby secret lair and effortlessly run them off."),
        __("None of them seems to have any idea exactly what to do about it though - the dragon is just too powerful.  The air fills with angry grumbles."),
        __("\"The dragon has to die!\" one of them yells, standing and waving his arms at the others.  \"It freaking _melted_ poor Eddie!  Who's with me?\""),
        __("Silence reigns while feet are awkardly shuffled.  The standing bandit sits back down, dejected."),
        { text: __("A bottle is passed around, and the conversation descends into depressed mumbles."), title: __("You can hear no more."), buttonText: __("Leave"), buttonAction: "encounter", buttonParams: { type: ENCOUNTER_NAME, action: ACTION_LEAVE } }
      ], character);
    }
    else if (ACTION_LEAVE === action) {
      title = __("You creep away quietly, escaping all notice.");

      character.setStat(STATS.BANDIT_CLEARING);
      character.state = CHARACTER_STATE.IDLE;

      await this.updateLast({
        attachments: Attachments.one({ title }),
        doLook: true
      });

    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }
  }
}

module.exports = BanditClearingEncounter;