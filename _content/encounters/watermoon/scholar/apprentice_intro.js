"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const FLAGS = require('@constants').FLAGS;

const ENCOUNTER_NAME = 'watermoon-scholar-apprentice_intro';
const ACTION_WHAT_HAPPENED = 'what_happened';

/**
 * Jilted apprentice introductory encounter.
 */
class ApprenticeIntroEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You approach the dishevaled woman and greet her.  At first, she doesn't respond, but after a moment of continued reading, she marks her place in the book and looks up.\n\n\"What do you want?\" she asks.  \"I'm studying, as you obviously haven't noticed.\""),
      actions: Actions.oneButton(__("What happened?"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_WHAT_HAPPENED } } )
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
    return __(": Apprentice");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_WHAT_HAPPENED === action) {
      await this.updateLast({
        attachments: Attachments.one({ title: __(":white_check_mark: Got it!") })
      });

      character.setFlag(FLAGS.IN_CUTSCENE);
      character.inventory.add('tool-labyrinth_key');

      character.slashbot.tellStory([
        __("She sighs, sets her book down, and gestures at the empty Quad around her.  \"What, you can't recognize a bustling campus when you see one?  This doesn't look like the heart of learning to you?  Well congratulations, genius.  You're probably smart enough to enrol here.\""),
        __("She pinches the bridge of her nose and breathes deeply.  \"Look, I'm just under a lot of pressure here.  I don't have the trickier parts of Differential Etherology down yet, exams are in only a few weeks, and I don't know if my *professors* will even *come back* to administer them!\""),
        __("\"When that Black Dragon showed up and took up residence in the Labyrinth beneath us, the cowards all left!  And with no professors, the students partied for a while, then trickled off to go do other things.\""),
        __("Her face hardens and she begins to pace back and forth, lost in her story.  \"Of course, they *have* that option.  Practically every student here is a child of wealth and privilege and has a life of plenty to return to.\""),
        __("\"Me, I scrambled and scraped to get in here.  I don't have the money to pay for another year's worth of tuition if this fall through, and I certainly don't have any opportunities back in the fishing village I came from.\""),
        __("She stops pacing for a moment and turns to face you, truly noticing you for the first time.  Her eyes take in your equipment, your posture, your bearing, and her eyes light up.  \"You're an adventurer!\" she exclaims."),
        __("\"Adventurers do things like this all the time, right?  You could go and kick that stupid dragon out and restore some order to this place, right?  I know you can.  You'll do it, right?  I'll even give you the Labyrinth Key you need to get in and kick some butt.  The professors certainly won't notice it missing.\""),
        __("You nod and accept they key, pleased that your aims align in such a way as to help this young woman."),
        __("\"Before you head in, you should know that the Labyrinth below can be very confusing.  You won't want to go in without some knowledge of how it's laid out.  Now, that information is in the Library over there, but you might have a bit of trouble digging up all the Clues you want.  It's gone a bit... feral since the professors left.\""),
        __("\"Anyway, I don't want to keep you,\" she says as she returns to her books, intent on getting back into her... Distractional Effigology or whatever.  You look at the key in your hand, the door to the Labyrinth, and the nearby Library, where Clues to guide you can be found.")
      ], character);
    }
    else {
      throw new Error(`Unknown action: ${action}.`);
    }
  }
}

module.exports = ApprenticeIntroEncounter;