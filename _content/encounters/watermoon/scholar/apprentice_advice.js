"use strict";

const { Actions, Attachments } = require('slacksimple');
const { Encounter }            = require('@app/content/encounters');
const { between }              = require('@util/random');

const { CHARACTER_STATE, FLAGS } = require('@constants');

const ENCOUNTER_NAME              = 'watermoon-scholar-apprentice_advice';
const ACTION_ADVICE               = 'advice';
const ACTION_NEVERMIND            = 'nevermind';
const ACTION_ASK_ABOUT_LICH_QUEEN = 'ask_lich_queen';

/**
 * Apprentice encounter where you can ask for advice.
 */
class ApprenticeAdviceEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: "You approach the young apprentice and wait for her to mark her place in her book.  \"Of course we're both *very busy*,\" she says pointedly.  \"What can I do for you?\"",
    });
  }

  /**
   * Get the actions for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();
    actions.addButton("Ask for Advice", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_ADVICE } });

    if (character.hasFlag(FLAGS.DIED_TO_LICH_QUEEN)) {
      actions.addButton("Lich Queen", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_LICH_QUEEN } });
    }

    actions.addButton("Nevermind", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_NEVERMIND } });

    return actions;
  }

  /**
   * Get the image for this encounter.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/watermoon/apprentice.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return ": Apprentice";
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let title;

    if (ACTION_ADVICE === action) {
      title = `"Well," she says contemplatively.  "I have heard a few things.  For example: ${this.getAdvice(character)}"`;
    }
    else if (ACTION_NEVERMIND === action) {
      title = "She shakes her head and picks her books back up.\"Of course, of course.  It's not like either of us was doing anyting important anyway...\"";
    }
    else if (ACTION_ASK_ABOUT_LICH_QUEEN === action) {
      title = "She looks thoughtful for a moment, then excitedly grabs a book from the pile beside her.  \"Well, it's well documented that liches are bastions of death magic, which is reportedly accompanied by an unnatural feeling of cold.  A great many scholars believe that you have to fight this cold with fire, but!\" She scoffs.  \"They'd be oh-so-wrong, ESPECIALLY in this case.  What you want to do, is cast an ICE spell when she has her Soul Jar open.  Seal it up, and her innate cold will prevent her from ever opening it again!\"";
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Get a random piece of advice.
   *
   * @param {Character} character - The character to tell the advice to.
   *
   * @preturn {string}
   */
  getAdvice(character) {
    const advice = [
      "Barren hallways are terrible.  Some kind of strange scavenger prowls them, I bet, and that's why you can't find any treasure in them.",
      "I don't know why they leave some of the hallways down there utterly dark.  It doesn't make sense, from a safety perspective.",
      "If you're not paying attention, you'll probably eventually take a detour you didn't plan on, and end up travelling far longer than you wanted to.",
      "Certain hallways are suspiciously easier than others.  I think it must be a trick, but others say not to look a gift horse in the mouth.  Hard to say who's right.",
      "Have you run into a particularly foul hallway down there yet?  Other students told tales, but I think they were trying to come up with a clever excuse to not clean their dormitory rooms.",
      "Oh, there's definitely ghost stories told about the Labyrinth.  Supposedly there's a haunted hallway just *full* of them, with glowing walls and scads of Moondrops sitting around for the brave to scoop up.  But they're just stories.",
      "Certain hallways are harder to deal with than others.  I mean, that's just probability though, of course.",
      "The Labyrinth criss-crosses beneath the Scholar grounds, and some tunnels must be under areas of extreme temperature divergence.  Some of them are coated in a permanent layer of ice!",
      "Some places on campus seem to dampen magic cast near them.  I'd bet that Labyrinth hallways that run beneath render you utterly unable to cast magic at all!",
      "With the collective net worth of the students who regularly go missing in the Labyrinth, it's no surprise that there are rumours of hallways lined floor to ceiling with gold.  I'd be surprised to actually run into any, of course.",
      "If you keep your head on a swivel, I bet you could find a shortcut or two down there.  Make sure to bring enough clues with you to be able to find them!",
      "Most hallways are pretty straight, but some double back on themselves and are longer than they first appear.",

      "They say there's a legitimate vampire spirit trapped down in the Labyrinth!  I'd be careful if I ran into any monsters looking a little too closely at your neck...",
      "Some people get trapped in the labyrinth on accident, while some head down there on purpose.  Rumour has it that there's a woman so ugly that she descended into the Labyrinth to escape society.  Apparently she was so disgusting she even had snakes for hair!",
      "Okay now, I did *not* tell you this, but apparently there's a half-man, half-bull creature down there?  I know, I know, I don't even want to *consider* how you get such a beast in the first place, but people say that you can hear it bellowing down there some nights.",

      "Certain books are more likely to have Labyrinth Clues in them than others.  I mean, obviously, but still...",
      "I hear the Black Dragon originally took residence in our Labyrinth because she believes herself to be smarter than everyone else, and where better to prove it than at Watermoon's Scholar District?  Bloody show-off.",
    ];

    return advice[this.chooseRandomAdvice(advice.length)];
  }

  /**
   * Choose a random piece of advice.
   *
   * @param {integer} length - The length of the array of advice that can be chosen from.
   *
   * @return {integer}
   */
  chooseRandomAdvice(length) {
    return between(0, length - 1);
  }
}

module.exports = ApprenticeAdviceEncounter;