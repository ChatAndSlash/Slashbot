"use strict";

const { Encounter } = require('@app/content/encounters');

const { PROFESSIONS, FLAGS } = require('@constants');

const ENCOUNTER_NAME              = 'watermoon-gilded-barad';
const ACTION_ASK_GLADIATORS       = 'ask_gladiators';
const ACTION_ASK_AXES             = 'ask_axes';
const ACTION_ASK_AURETH           = 'ask_aureth';
const ACTION_ASK_WATERMOON        = 'ask_watermoon';
const ACTION_ASK_AURETH_FINAL     = 'ask_aureth_final';
const ACTION_ASK_ABOUT_LICH_QUEEN = 'ask_lich_queen';

/**
 * Barad, the leader of the Gladiators.
 */
class BaradEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Gladiator image.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'professions/gladiator.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Barad, Gladiator Leader");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let response = '';

    if (ACTION_ASK_GLADIATORS === action) {
      response += __("> You ask Barad about what it's like to be a Gladiator.\n\n");

      if (character.hasMasteredProfession(PROFESSIONS.GLADIATOR)) {
        response += __("> \"As a Master Gladiator yourself, I'm sure you know the wonders of this life.\"  He claps you on the shoulder.  \"We should spar sometime!  Maybe make a bout of it!\"");
      }
      else {
        response += __("> \"The crowd, the cheering, the glory!  Your axe cleaving through your opponent's face!  It's amazing, I can't even describe it.\"");
      }
    }
    else if (ACTION_ASK_AXES === action) {
      response += __("> You ask Barad about axes.\n\n");

      if (character.hasMasteredProfession(PROFESSIONS.GLADIATOR)) {
        response += __("> He sighs dreamily.  \"They really *are* wonderful, aren't they?\"");
      }
      else {
        response += __("> He grabs his axe from his side, throws it into the air, spinning, and catches it *mostly* without cutting himself.  \"Axes are the wonderous weapon, the sweet slicers, the delicate decapitators...\"  He pauses, considers.  \"Well, maybe not delicate.  Still.  You'll find they do a lot more damage than any other weapon when you manage to find the sweet spot.\"");
      }
    }
    else if (ACTION_ASK_AURETH === action) {
      response += __("> You ask Barad about Aureth.  He grumbles under his breath, then replies.  \"She's _alright_, I suppose.  She's a cheater at cards, of that I'm sure!  Nobody's that lucky...  At least she's partial to a good brandy and more than willing to share.\"");
    }
    else if (ACTION_ASK_WATERMOON === action) {
      response += __("> You ask Barad about Watermoon.  \"Well, the city certainly has its low points.  The massive dragons floating around, driving people out of their house and home, for example.  But you'll never find a more appreciative population for gladiatorial combat!  Ahhhh, there's no other place like it.\"");
    }
    else if (ACTION_ASK_AURETH_FINAL === action) {
      if (character.hasFlag(FLAGS.ASKED_BARAD_AURETH)) {
        response += __("> You ask Barad if he has anything more to say about trusting Aureth.\n\n> \"You can trust her at your side, just not across from you at the card table.  That's all I'll say about that.\"");
      }
      else {
        response += __("> You ask Barad if Aureth can be trusted.\n\n> \"With my life!\" he bellows, hand clasped to his heart.  \"I mean...\" he stammers.  \"Yes, with my life.  But no, not with a natural flush draw on the river.  *Nobody's* that lucky.\"");
        character.setFlag(FLAGS.ASKED_BARAD_AURETH);
      }
    }
    else if (ACTION_ASK_ABOUT_LICH_QUEEN === action) {
      response += "> You ask Barad how to defeat the Lich Queen.\n\n> \"ATTAAAAAACK!\" he hollers.  \"You've got to get in there, feint, dodge, then counterattack and then attack and then attack and then keep attacking!\"";
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.slashbot.say(response, character);

    await this.updateLast({
      doLook: true,
    });
  }
}

module.exports = BaradEncounter;
