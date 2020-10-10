"use strict";

const { Encounter } = require('@app/content/encounters');

const { PROFESSIONS, FLAGS } = require('@constants');

const ENCOUNTER_NAME              = 'watermoon-gilded-nicholas';
const ACTION_ASK_MIST_DANCERS     = 'ask_mist_dancers';
const ACTION_ASK_HIDDEN_DAGGERS   = 'ask_hidden_daggers';
const ACTION_ASK_AURETH           = 'ask_aureth';
const ACTION_ASK_WATERMOON        = 'ask_watermoon';
const ACTION_ASK_AURETH_FINAL     = 'ask_aureth_final';
const ACTION_ASK_ABOUT_LICH_QUEEN = 'ask_lich_queen';

/**
 * Nicholas, the leader of the Mist Dancers.
 */
class NicholasEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Mist Dancer image.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'professions/mist_dancer.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return ": Nicholas, Mist Dancer Leader";
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

    if (ACTION_ASK_MIST_DANCERS === action) {
      response += "> You ask Nicholas about what it's like to be a Mist Dancer.\n\n";

      if (character.hasMasteredProfession(PROFESSIONS.MIST_DANCER)) {
        response += "> \"That rhythm, that style, that absolute deadly grace!  ...I don't suppose you could come in and teach once or twice a week?  We could always use someone of your experience.\"";
      }
      else {
        response += "> He executes a perfect pirouette and finishes with a flourish.  You look down, surprised to see that he's holding a knife at your throat.  He laughs, then makes it disappear.\n\n> \"Not the least of the tricks up my sleeve.\"";
      }
    }
    else if (ACTION_ASK_HIDDEN_DAGGERS === action) {
      response += "> You ask Nicholas about hidden daggers.\n\n";

      if (character.hasMasteredProfession(PROFESSIONS.MIST_DANCER)) {
        response += "> He keeps a few steps back.\n\n> \"You're not hiding any on you just now, are you?\"  He smiles.  \"Of course you are.  You've learned well.\"";
      }
      else {
        response += "> \"Precise, personal, deadly.  Take a moment to hide them from your opponent's eyes, and then unleash hell when you reveal them.\"";
      }
    }
    else if (ACTION_ASK_AURETH === action) {
      response += "> You ask Nicholas about Aureth.  He laughs.\n\n> \"She's a big softie.  Has a real weakness for hot chocolate.  Pretends to be all big and scary and \"you better pay me!\" and all, but if you slip some mini marshmallows in a warm cup, she's a pussycat.\"";
    }
    else if (ACTION_ASK_WATERMOON === action) {
      response += "> You ask Nicholas about Watermoon.\n\n> \"A lot of people have a lot of fond memories of this town.\"  He scoffs.  \"It was never anything special.  It always had a seedy underbelly, it's just that more people can see it now.\"";
    }
    else if (ACTION_ASK_AURETH_FINAL === action) {
      if (character.hasFlag(FLAGS.ASKED_NICHOLAS_AURETH)) {
        response += "> You ask Nicholas if he has anything more to say about trusting Aureth.\n\n> \"Not really.  She's proven herself.\"";
      }
      else {
        response += "> You ask Nicholas if Aureth can be trusted.  He raises his eyebrows.\n\n> \"I'm surprised you'd even ask.  I only wish I could protect my charges the way she protects this district.  If she had her way, this whole town would be safe again.  I think that's why she put you up to dealing with those other dragons, to be honest.\"";
        character.setFlag(FLAGS.ASKED_NICHOLAS_AURETH);
      }
    }
    else if (ACTION_ASK_ABOUT_LICH_QUEEN === action) {
      response += "> You ask Nicholas how to defeat the Lich Queen.\n\n> \"You must have a strong defence.  If she cannot hurt you, she can't defeat you.  Of course, if she *can* hurt you, hm...\"  He trails off, lost in thought.";
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

module.exports = NicholasEncounter;
