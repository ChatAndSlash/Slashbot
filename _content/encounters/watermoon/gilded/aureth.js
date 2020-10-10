"use strict";

const { Encounter }                     = require('@app/content/encounters');
const { Actions, Attachments, Options } = require('slacksimple');
const { isChristmas }                   = require('@util/events');

const { CHARACTER_STATE, COLORS, FLAGS } = require('@constants');

const ENCOUNTER_NAME                = 'watermoon-gilded-aureth';
const ACTION_ASK_ABOUT_WATERMOON    = 'ask_watermoon';
const ACTION_ASK_ABOUT_RUMBLE       = 'ask_rumble';
const ACTION_ASK_ABOUT_RED_DRAGON   = 'ask_red_dragon';
const ACTION_ASK_ABOUT_SCHOLAR      = 'ask_scholar';
const ACTION_ASK_ABOUT_BLACK_DRAGON = 'ask_black_dragon';
const ACTION_ASK_ABOUT_MYSTIC       = 'ask_mystic';
const ACTION_ASK_ABOUT_NECRODRAGON  = 'ask_necrodragon';
const ACTION_ASK_ABOUT_PHAERA       = 'ask_phaera';
const ACTION_ASK_ABOUT_OBSIDIA      = 'ask_obsidia';
const ACTION_ASK_ABOUT_LICH_QUEEN  = 'ask_lich_queen';
const ACTION_LYSTONE                = 'lystone';
const ACTION_PARTNERS               = 'partners';
const ACTION_LEAVE                  = 'leave';

/**
 * Aureth, the golden dragon.
 */
class AurethEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Get description for this encounter.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getDescription(character) {
    let description = "You stride up to the giant golden dragon and address her as confidently as you can.  She rolls her eyes and snorts, tiny gouts of lightning sparking forth from her nostrils.";

    if (isChristmas()) {
      description += "\n\nIn a concession to the season, you note that Aurent is wearing a jaunty red holiday cap, with white fur trim and small (for her) bells that tinkle gently when she moves.  You consider bringing it up, but quickly think better of it.";
    }

    // Killed all dragons, but don't have Lystone yet?
    if (character.location.areAllDragonsDead(character) && ! character.location.hasLystone(character)) {
      if (this.ifAllLeadersSpokenWith(character)) {
        description += "\n\n\"Looks like you and I got stuff to talk about.\"";
      }
      else {
        description += "\n\n\"Have you had a chance to talk to all the Guild Leaders?\"";
      }
    }
    // Just kinda informal
    else {
      description += "\n\n\"What is it now, kid?\"";
    }

    return description;
  }

  /**
   * Image of Aureth.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'characters/aureth.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return ": Aureth";
  }

  /**
   * Get the action buttons for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {array}
   */
  getActions(character) {
    let actions = new Actions();

    if (character.location.areAllDragonsDead(character) &&
      ! character.location.hasLystone(character) &&
      this.ifAllLeadersSpokenWith(character)) {

      actions.addButton("Okay, let's talk.", "encounter", { params: { action: ACTION_LYSTONE } });
    }

    // Build conversation choices
    let options = new Options;
    options.add("Watermoon", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_WATERMOON });
    options.add("Phaera", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_PHAERA });
    options.add("Obsidia", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_OBSIDIA });

    options.add("Rumble District", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_RUMBLE });
    options.add("Red Dragon", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_RED_DRAGON });

    if (character.hasKilledRedDragon()) {
      options.add("Scholar District", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_SCHOLAR });
      options.add("Black Dragon", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_BLACK_DRAGON });
    }

    if (character.hasKilledBlackDragon()) {
      options.add("Mystic District", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_MYSTIC });
      options.add("Necrodragon", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_NECRODRAGON });
    }

    if (character.hasFlag(FLAGS.DIED_TO_LICH_QUEEN)) {
      options.add("Lich Queen", { type: ENCOUNTER_NAME, action: ACTION_ASK_ABOUT_LICH_QUEEN });
    }

    actions.addSelect("Ask about...", "encounter", options.getCollection());

    actions.addButton("Leave", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE } } );
    return actions;
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_LEAVE === action) {
      await this.doLeave(character);
    }
    else if (ACTION_LYSTONE === action) {
      character.slashbot.tellStory([
        { npc: "aureth", text: "\"Okay, so hopefully by now, you can see that you and I, we're on the same time, right?  Like, maybe I'm a dragon and you're a feather-spirited human, but we both want to beat the stuffing out of the greedy, mean, and evil dragons out there.\"" },
        { npc: "aureth", text: "\"So I propose a formal alliance.  You and I, we take on my mom together.  I don't think Birdmom would be *too* upset about that.  She's more focused on dealing with Obsidia to worry about dealing with little ol' me just now.\"" },
        { npc: "aureth", text: "\"I mean, I know we've basically cleaned out this city of dragons and there aren't any others in obvious view right now, but as soon as we find one, we take it out!  Right?\"" },
        { npc: "aureth", text: "\"But in the meantime, I could use your help here in Watermoon for a bit.  In the absense of the Red, Black, and Necrodragons, local puffed-up baddies have taken their place and need to be dealt with.\"" },
        { npc: "aureth", text: "\"Nine powerful beings have come into posession of a tiny chip of a Lystone.  Lystones are immensely powerful gems that grant their wielder untold power.  Even just a chip from one has granted them immense power.\"" },
        { npc: "aureth", text: "\"So what *you're* gonna do, is you're gonna go kill _each_ and _every_ one of them.  They've likely taken over the districts, so you should be able to find them where you found the dragons before.\"" },
        { npc: "aureth", text: "\"To help, you're going to want this:\"" },
        "Aureth hands you a dull green stone with several chips missing.",
        { npc: "aureth", text: "\"That's -- as you've probably guessed -- a Lystone.  I'm not sure how to take advantage of it, but I'm sure you'll figure it out.  At a minimum, if you can recover the nine chips, you should be able to unlock *something* to do with it.\"" },
        { npc: "aureth", text: "\"So whaddaya say?  Partners?\"", title: "You reply:", buttonText: "Sure.  Partners.", buttonAction: "encounter", buttonParams: { type: ENCOUNTER_NAME, action: ACTION_PARTNERS } },
      ], character);
    }
    else if (ACTION_PARTNERS === action) {
      character.inventory.add('quest-watermoon-lystone');
      character.clearFlag(FLAGS.ASKED_BELTARA_AURETH);
      character.clearFlag(FLAGS.ASKED_NICHOLAS_AURETH);
      character.clearFlag(FLAGS.ASKED_BARAD_AURETH);

      character.slashbot.tellStory([
        "You nod, reach out, and shake her outstretched claw with your hand as she smirks.",
        { npc: "aureth", text: "\"Awesome.  Good luck dealing with the baddies.  I'll hold down the fort here.\"" },
      ], character);
    }
    else {
      await this.talkAbout(action, character);
    }
  }

  /**
   * Don't ask about anything.
   *
   * @param {Character} character - The character performing the action.
   */
  async doLeave(character) {
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({
        title: "You leave Aureth to her dinner.",
      }),
      doLook: true
    });
  }

  /**
   * Have a chat with Aureth.
   *
   * @param {string} action - The thing to talk about.
   * @param {Character} character - The character doing the talking.
   */
  async talkAbout(action, character) {
    let description = '';

    if (ACTION_ASK_ABOUT_WATERMOON === action) {
      description = "You ask Aureth about Watermoon.\n\n\"You know, I *really* love this city!  Sure, there's an undead Necrodragon, a power-mad Red Dragon, and an intolerant and prissy Blue Dragon all fighting me for it, but...  Well, it's just got this _charm_, you know?\"";
    }
    else if (ACTION_ASK_ABOUT_PHAERA === action) {
      description = "You ask Aureth about Phaera.\n\n\"What can I really say about Birdmom?  She's crazy, recruiting humans to do her dirty work.  Not to mention that her dirty work is, well, killing all of us dragons.  Still, it works to my benefit in this case.  Well, kinda, anyway.  But we're pals, right?\"\n\nShe winks at you.";
    }
    else if (ACTION_ASK_ABOUT_OBSIDIA === action) {
      description = "You ask Aureth what she thinks about Obsidia.  She sighs.\n\n\"Oh, mom.  I know she doesn't approve of what I do here, all this human interaction and all, but sometimes you just gotta live your life, you know?\"\n\nShe gives you a hard look.  \"Besides, she put _you_ up to killing me.  It's not like _she's_ above trying something wacky.\"";
    }

    else if (ACTION_ASK_ABOUT_RUMBLE === action) {
      if (character.hasKilledRedDragon()) {
        description = "You ask Aureth about the Rumble District.\n\n\"Well, you cleaned out the Red Dragon, which is great, but there's still plenty of thugs there looking for a new leader.  You're going to have to keep on top of that.\"";
      }
      else {
        description = "You ask Aureth about the Rumble District.\n\n\"You know, I just can't stand the thungs that hang out in that area of town.  They come from literally all over to join gangs there.  Boggles the mind, ya know?\"";
      }
    }
    else if (ACTION_ASK_ABOUT_RED_DRAGON === action) {
      if (character.hasKilledRedDragon()) {
        description = "You ask Aureth what she thinks about the Red Dragon in the Rumble District.\n\n\"Joanie and I used to play Bridge back in the day.  Good times, hiding under bridges, scaring the pants off of peasants...  Ah, the old days.\"";
      }
      else {
        description = "You ask Aureth what she thinks about the Red Dragon in the Rumble District.\n\n\"You're gonna have to be super buff before you take on ol' Red.  She's really gotten into working out lately, and it *shows.*\"";
      }
    }

    else if (ACTION_ASK_ABOUT_SCHOLAR === action) {
      if (character.hasKilledBlackDragon()) {
        description = "You ask Aureth about the Scholar District.\n\n\"Well, the labyrinth under the Scholar District was *briefly* clear, but nature abhors a vacuum, I guess.  Can you go back in and see who moved in and needs the stuffing beaten out of 'em?\"";
      }
      else {
        description = "You ask Aureth about the Scholar District.\n\n\"We used to have one of the leading schools around, you know that?  The tunnels underneath were legendary - students could attend any class, obtain any supplies necessary without ever going outside.\"";
      }
    }
    else if (ACTION_ASK_ABOUT_BLACK_DRAGON === action) {
      if (character.hasKilledBlackDragon()) {
        description = "You ask Aureth what she thinks about the Black Dragon in the Scholar District.\n\n\"You know, I'm super glad she's gone?  Such a know-it-all.  Even for a dragon, she could have learned some humility.\"";
      }
      else {
        description = "You ask Aureth what she thinks about the Black Dragon in the Scholar District.\n\n\"I don't know her too well, but she makes me feel uneasy.  She showed up one day, asked me a bunch of irrelevant nonsense, then called me an idiot and took over the Scholar District.  Can't be rid of her fast enough, in my opinion.\"";
      }
    }

    else if (ACTION_ASK_ABOUT_MYSTIC === action) {
      if (character.hasKilledNecrodragon()) {
        description = "You ask Aureth about the Mystic District.\n\n\"You did a good job cleaning that place out, except, well, you know what a power vacuum is, right?  Yeah, well, some big tough jerks have shown up to fill it.  Feel like trekking on back there to clean that up for me?\"";
      }
      else {
        description = "You ask Aureth about the Mystic District.\n\n\"Some real whackos live there, you know, and it's only gotten worse since the High Magister got chased out by miss high-and-mighty _'Necrodragon.'_  Anyway, they think they can figure out a closer connection to the source of magic by busting on into other planes.  Playin' with fire there, you know?  Well, not real fire, I mean, thankfully they never figured out how to get into _that_ plane.\"";
      }
    }
    else if (ACTION_ASK_ABOUT_NECRODRAGON === action) {
      if (character.hasKilledNecrodragon()) {
        description = "You ask Aureth what she thinks about the Necrodragon in the Mystic District.\n\n\"I can't say I'll miss her.  I had big plans for that district and she messed it all up.  Even now that she's dead, it'll take forever to get the planes back under control and attract some more mages to start research back up.  Of course, it'll go a lot quicker if you wanna help...\"";
      }
      else {
        description = "You ask Aureth what she thinks about the Necrodragon in the Mystic District.\n\n\"Cassie?  Oh my god, I'm *so sick* of her, you know?\"  She rolls her eyes theatrically.  \"I mean I know she calls herself the 'Necrodragon' these days, all 'Queen of Death, Darkness, and the Night Sky', but how full of yourself can you _get?_  When she was little, Cassiopeia was afraid of bugs and now she thinks she's Big Miss Thing because she learned a bit of necromancy?  Please.\"";
      }
    }

    else if (ACTION_ASK_ABOUT_LICH_QUEEN === action) {
      description = "You ask Aureth if she knows anything about how to kill the Lich Queen.\n\n\"Phoof, ya got me, kid,\" she says, laughing. \"I dunno, she's a ghost or something, right?  Maybe get all preachy in her face, see if that works.  I think you're gonna have to keep asking around.\"";
    }

    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    let attachments = new Attachments().add({
      title: "What can I do for you?",
      fields: character.getFields(),
      color: COLORS.INFO,
      actions: this.getActions(character)
    });

    await this.updateLast({
      description,
      attachments,
    });
  }

  /**
   * If the character has spoken with all the leaders.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  ifAllLeadersSpokenWith(character) {
    return character.hasFlag(FLAGS.ASKED_BELTARA_AURETH)
      && character.hasFlag(FLAGS.ASKED_NICHOLAS_AURETH)
      && character.hasFlag(FLAGS.ASKED_BARAD_AURETH);
  }
}

module.exports = AurethEncounter;
