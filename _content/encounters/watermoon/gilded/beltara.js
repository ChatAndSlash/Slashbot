"use strict";

const Encounter   = require('@app/content/encounters').Encounter;

const PROFESSIONS = require('@constants').PROFESSIONS;
const FLAGS       = require('@constants').FLAGS;

const ENCOUNTER_NAME              = 'watermoon-gilded-beltara';
const ACTION_ASK_BATTLE_WITCHES   = 'ask_battle_witches';
const ACTION_ASK_GUNS             = 'ask_guns';
const ACTION_ASK_AURETH           = 'ask_aureth';
const ACTION_ASK_WATERMOON        = 'ask_watermoon';
const ACTION_ASK_AURETH_FINAL     = 'ask_aureth_final';
const ACTION_ASK_ABOUT_LICH_QUEEN = 'ask_lich_queen';

/**
 * Beltara, the leader of the Battle Witches.
 */
class BeltaraEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Battle witch image.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'professions/battle_witch.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return ": Beltara, Battle Witch Leader";
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

    if (ACTION_ASK_BATTLE_WITCHES === action) {
      response += "> You ask Beltara about what it's like to be a Battle Witch.\n\n";

      if (character.hasMasteredProfession(PROFESSIONS.BATTLE_WITCH)) {
        response += "> She looks you up and down and smiles.\n\n> \" You've come a long way, and it shows.  I can practically see magic crackling around you.  You do us proud.\"";
      }
      else {
        response += "> \"Battle Witches are a rare breed.  We're those who are just as interested in the terrifying power of magic as we are the exhilerating thrill of combat.  Plus, we know our way around some sweet weaponry that most others confuse for magic anyway.\"";
      }
    }
    else if (ACTION_ASK_GUNS === action) {
      response += "> You ask Beltara about her opinion about guns.\n\n";

      if (character.hasMasteredProfession(PROFESSIONS.BATTLE_WITCH)) {
        response += "> \"Honestly, I sort of get the feeling that I should be asking you *your* opinion.\"";
      }
      else {
        response += "> \"They're not the kind of weapon you can just pick up and master.  You have to learn precise aim, ammo management, and most importantly, how to look _good_ while firing them.\"";
      }
    }
    else if (ACTION_ASK_AURETH === action) {
      response += "> You ask Beltara about Aureth.\n\n> \"She's sly, that one.  But I prefer a sly dragon to a bully, a hoarder, or an evil dragon.\"  She thinks for a moment, then continues.  \"Her taste in tea is excellent.  Definitely take her up on her offer if she invites you around for a cup.\"";
    }
    else if (ACTION_ASK_WATERMOON === action) {
      response += "> You ask Beltara about Watermoon.  She signs.\n\n> \"It used to be such a nice city.  I mean, it's not awful, but it *all* used to be a nice city.  I went to school here, in the University, did you know?  But then the dragons all showed up, and now you can only really make a living in one district.  We do all right, but we used to do so much better than all right.\"";
    }
    else if (ACTION_ASK_AURETH_FINAL === action) {
      if (character.hasFlag(FLAGS.ASKED_BELTARA_AURETH)) {
        response += "> You go to ask Beltara more about Aureth, but she's lost in thought.  Maybe it's best to leave her...";
      }
      else {
        response += "> You ask Beltara if Aureth can be trusted.\n\n> \"Trusted?  I'd trust her about as far as I could...\" she starts, then stops.  \"Well, she's kept the Gilded District safe.  Without her, there'd be literally no Watermoon left to live in.  So I suppose, yeah.\"";
        character.setFlag(FLAGS.ASKED_BELTARA_AURETH);
      }
    }
    else if (ACTION_ASK_ABOUT_LICH_QUEEN === action) {
      response += "> You ask Beltara how to defeat the Lich Queen.\n\n> \"Definitely magic,\" she says. \"Of course, I'm not sure what magic to use, exactly, but Liches are beings of magic, so it stands to reason that you'd need to use the right magic back against them.\"";
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

module.exports = BeltaraEncounter;
