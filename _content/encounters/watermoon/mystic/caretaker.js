"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const FLAGS = require('@constants').FLAGS;

const ENCOUNTER_NAME = 'watermoon-mystic-caretaker';
const ACTION_I_GUESS = 'i_guess';

/**
 * Mystic District Workshop Caretaker.
 */
class MysticCaretakerEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You approach the tall man.\n\n\"Hullo,\" says he.  \"I figure yer here'n ta clean up, yeah?\""),
      actions: Actions.oneButton(__("I... guess?"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_I_GUESS } } )
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
    return 'encounters/watermoon/caretaker.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Workshop Caretaker");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_I_GUESS === action) {
      await this.updateLast({
        attachments: Attachments.one({ title: __(":white_check_mark: Got it!") })
      });

      character.setFlag(FLAGS.IN_CUTSCENE);
      character.inventory.add('tool-dowsing_staff');

      character.slashbot.tellStory([
        __("He nods, spits, and stands."),
        __("\"Wellup.  I been workin' here for nigh-on forty-six years or so.  Pay's solid, and these here magical types don't get much up in your craw 'nless you forget summat, and I tend not ta.\""),
        __("\"When a sudden one day come a gigantic, bone-white dragon, dark purple burning pits of fire for eyes.  Intimidating, she was.\""),
        __("\"High Magister didn't care, though.  He stepped up to converse as he please, as if this happened every Tuesday.\""),
        __("He gives you a significant look.  \"It didn't, you understand.\"  You nod, and he continues."),
        __("\"Anahow, dragon dint want to chat, it seems.  She burnt the High Magister half to a crisp, and he skedaddled outta town.  Hasn't been back.\""),
        __("\"That dragon, she's gone and holed up in that there Mausoleum, but she went and locked it up first with some Soul Gems she bound to powerful folk in the planes we had under study here.\""),
        __("\"You're gone ta need to hunt them down, and it gets confusing in them planes, so take this here with you.\"  He hands you a long, thin rod that begins drawing you towards some of the buildings nearby."),
        __("\"That's a dowsing staff, which'n you can use in the planes to find you way to the Soul Gems, make life easy.  Well, easier.\""),
        __("\"But afore you do _that_, you'll need ta open the portals to the planes back up.  Luckily, the High Magister and his associated magical folk didn't clean up on the way out.  You can slip on over to the Workshop they was using and pick up some Essence Crystals there.  Should be able to dig up enough to open them portals.\""),
        __("\"Now, if'n you don't mind, I'll set back down again, get back to my pipe before it goes out.\"  You nod, he nods, and he sits back down, eyes closing and a relaxed look coming over his face."),
      ], character);
    }
    else {
      throw new Error(`Unknown action: ${action}.`);
    }
  }
}

module.exports = MysticCaretakerEncounter;