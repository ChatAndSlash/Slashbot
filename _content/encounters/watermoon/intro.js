"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;

const FLAGS = require('@constants').FLAGS;
const STATS = require('@constants').STATS;

const ENCOUNTER_NAME        = 'watermoon-intro';
const ACTION_WHATS_GOING_ON = 'whats_going_on';
const ACTION_UNHAND_ME      = 'unhand_me';

/**
 * Watermoon intro encounter.
 */
class WatermoonIntroEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You board the stagecoach and settle in as it bumps and rumbles along its way to Watermoon.  The rocking of the carriage is soothing, and you fall fast asleep.  Hours - you assume - later, you're roughly awoken by stony-faced guards manhandling you out of the carriage and forcing you at weapon-point to march through the city of - again, you assume - Watermoon."),
      actions: Actions.oneButton(__("What's going on?"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_WHATS_GOING_ON } } )
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
    return 'characters/narrator.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Narrator");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  doAction(action, character, message) {
    if (ACTION_WHATS_GOING_ON === action) {
      this.updateLast({
        attachments: Attachments.one({ title: __(":white_check_mark: Got it!") })
      });

      character.setFlag(FLAGS.IN_CUTSCENE);
      character.slashbot.tellStory([
        __("The guards haul you through the city to a building clearly labelled \"Exchange\" and march you inside.  A massive golden dragon lies lazily curled up inside.  She perks up as you're escorted into the room."),
        { npc: "aureth", text: __("\"Oh!  Oh oh oh, hey hey!  You gotta be that phoenix kid, the one Birdmom sent after all us scaleys!  Haha, this is great, I've been meaning to meetcha.  Name's Aureth, how you doing?\""), title: __("You reply:"), buttonText: __("Unhand me!"), buttonAction: "encounter", buttonParams: { type: ENCOUNTER_NAME, action: ACTION_UNHAND_ME } },
      ], character);
    }
    else if (ACTION_UNHAND_ME === action) {

      const Locations    = require('@app/content/locations').Locations;
      character.location = Locations.new("watermoon-gilded-courtyard");
      character.gold += 1000;
      character.setStat(STATS.WATERMOON_INTRO);

      character.slashbot.tellStory([
        { npc: "aureth", text: __("\"Hah!  Ya got spunk, I'll give that to ya!\"") },
        __("She winks at you and nods to the guards.  They let you go and step back, taking up a position by the exits."),
        { npc: "aureth", text: __("\"So look.  I know Birdmom - I guess you'd know her as Phaera - sent you over here to tan my scaley hide, right?  And sure, fine, we can get into that at some point if you really wanna, we can deal with that later.  But _first_, I think we can actually both help each other out here.\"") },
        { npc: "aureth", text: __("\"See, there are actually *four* dragons in this town, if you count yours truly.  The other three districts around here all have a big bad dragon ruling them, and frankly, they're getting under my scales!  So I want you to kill 'em.\"") },
        { npc: "aureth", text: __("\"And why not kill me first, right?  I get it, good question.  Well here's the thing.  The folks in this district, well, we're friends, or at least friendly, sorta.  They basically all work for me, and if I say no, or I guess, if you kill me, they'll take offence and _probably_ won't do business with you.\"") },
        { npc: "aureth", text: __("\"Right?  Cool, so how about you scamper along and take care of those other three dragons?  Hey, lemme sweeten the pot, actually!  All those shops I mentioned?  Well, go stock up before you head out.  This should help the cause!\"") },
        __("Aureth snags a small brown sack near her with a claw, swings it around for a second, guaging the weight, and tosses it to you."),
        { npc: "aureth", text: __("\"Should be a thousand gold in there, and I mean, whatever, maybe you don't wanna take money from a dragon, but whatever!  Money's just money, and it all spends just fine!") },
        __("A short lady with a clipboard steps forward and coughs insistantly.  Aureth sighs."),
        { npc: "aureth", text: __("\"Yeah, yeah, I know.  Look, I gotta go over the books.  It's a daily thing, but it's important and I _do_ love it so.  You go tour around town, spend that money, and if you need anything else, come back and ask.\"") },
        { npc: "narrator", text: __("With that, you find yourself escorted out onto the street by the guards, who then leave you to your own devices."), title: __("You take a moment to collect yourself and then:"), buttonText: __("Continue"), buttonAction: "continue" },
      ], character);
    }
    else {
      throw new Error(`Unknown action: ${action}.`);
    }
  }
}

module.exports = WatermoonIntroEncounter;