"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const FLAGS           = require('@constants').FLAGS;
const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME = 'scatterslide-intro';
const ACTION_HELP    = 'help';
const ACTION_CONFIRM = 'confirm';

/**
 * Introduction to Scatterslide Mines.
 */
class ScatterslideIntroEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __('"Yer that hero from Tyrose, hm?" he says, as he looks you up and down.  "Don\'t look like much.  Anyway, if ya want ta help, you best hunker down and listen first, so ya know what yer up against."'),
      actions: Actions.oneButton(__("I'll Help"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_HELP } } )
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
    return 'encounters/scatterslide/foreman.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Mine Foreman");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_HELP === action) {
      await this.updateLast({
        attachments: Attachments.one({ title: __(":white_check_mark: Got it!") })
      });

      character.setFlag(FLAGS.IN_CUTSCENE);

      const story = [
        __('"Well," he begins.  "This wasn\'t a terribly profitable mine at any point, ya gotta understand.  But we worked it, and it provided for us."  The men around the campfire nod and grunt in agreement.'),
        __('"So when that *Brown Dragon* showed up and took over the depths, there wasn\'t really anyone willin\' to help out.  No baron or count whose estate depended on the incomes or anything.  Just us.  Precious few of us are fighters, and none of us are up to the task of fightin\' a _dragon_, anyhow."'),
        __('"Anyhow, if ya think ya can help, yer gonna have to get all the way to the Underdrift, the lowest level of the mine, which is where that *Brown Dragon* will be.  We\'ve seen it dive through earth like a fish through water, so gettin\' down there is no problem for it.  For you though, that\'s another matter."'),
        __('"You\'ll run into quite a few goblins and such that have taken over as we\'ve stepped out, and you\'ll have to pick up the explosives we left behind to open up the entrance to the mine."'),
        __('"If you run across any exposed ore, make sure to haul it on out of there.  Though to start, we could use some stones from that Quarry to start rebuilding around here.  Rebuild the Blacksmith and we can sell you some fine equipment to help."')
      ];

      for (let idx = 0; idx < story.length; idx++) {
        character.slashbot.say(story[idx], character, { messageDelay: idx * 5, typing: true });
      }

      character.slashbot.say(
        __('"Oh, and feel free to ask around the campfire for help," he says.  "We may not be able to do much about the dragon, but that doesn\'t mean we haven\'t got anything to teach."'),
        character,
        {
          attachments: Attachments.one({
            title: __('Are you ready?'),
            actions: Actions.oneButton(__("I'm ready"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CONFIRM } })
          }),
          messageDelay: story.length * 5
        }
      );
    }
    else if (ACTION_CONFIRM === action) {
      character.clearFlag(FLAGS.IN_CUTSCENE);
      character.setStat(STATS.SCATTERSLIDE_INTRO);
      character.state = CHARACTER_STATE.IDLE;
      await this.updateLast({
        attachments: Attachments.one({ title: __(":white_check_mark: Got it!") }),
        doLook: true
      });
    }
    else {
      throw new Error(`Unknown action: ${action}.`);
    }
  }
}

module.exports = ScatterslideIntroEncounter;