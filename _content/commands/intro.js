"use strict";

const Command     = require('@app/content/commands').Command;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const FIRST_STAGE  = '1';
const SECOND_STAGE = '2';

/**
 * Display intro text to the game.
 */
class IntroCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const phaeraChar = character.slashbot.getNpc('phaera', character);
    const narratorChar = character.slashbot.getNpc('narrator', character);

    await this.updateLast({
      attachments: Attachments.one({ title: __(":white_check_mark: Got it!") }),
    });

    if (this.info.stage === FIRST_STAGE) {
      // Tell the story
      const story = [
        __("My name is Phaera.  I am the Great Phoenix, mother of this world, and I must tell you a story."),
        __("Long ago, Dragon and Phoenix lived in harmony."),
        __("Obsidia, the Great Dragon, and I were very much in love, and the fruit of our union was the world and all the creatures in it."),
        __("As was her nature, Obsidia loved the unchanging earth, while I found myself drawn more to the ever-changing life that lived upon it."),
        __("Over time, our interests drifted apart, and, I am ashamed to admit, we did as well."),
        __("The sorest point between us was this: What would become of the world?"),
        __("Obsidia wanted to be rid of all life upon it, so it could remain unchanging forevermore.  I, of course, opposed the idea."),
        __("As millenia went by, our disagreements grew until they reached the scale of all-out combat.  It was war among the gods."),
        __("Obsidia sent her children, the dragons, to the earth to carry out her will."),
        __("Humans are my children, and rebirth is my domain, so I choose my champions from those like yourself who are on the verge of this world and the next."),
        __("You will become my champion, and I will set before you a task: you must seek out and destroy the dragons that so threaten us all."),
        __("If you accept my task, I will imbue you with a piece of the Phoenix Soul.  This will allow you to become more powerful than you can imagine."),
        __("Dragons are immortal creatures, and it is only by the all-consuming fire of the phoenix soul you will carry that they can be stopped."),
      ];
      for (let idx = 0; idx < story.length; idx++) {
        character.slashbot.say(story[idx], phaeraChar, { messageDelay: idx * 5, typing: true });
      }

      // Ask for final confirmation
      character.slashbot.say(
        __("This will be a difficult task, but without your intercession, the Dragons will destroy every living thing."),
        phaeraChar,
        {
          attachments: Attachments.one({
            title: __('Do you understand?'),
            actions: Actions.oneButton(__("I understand"), "intro", { params: { stage: SECOND_STAGE } }),
          }),
          messageDelay: story.length * 5
        }
      );
    }
    else if (this.info.stage === SECOND_STAGE) {
      // Set up heading into town and Green Dragon
      const story = [
        __("She smiles, and flames rise around you.  It should burn you to a cinder, but instead you can feel it infusing your skin, your bones, your very soul."),
        __("When the flames die down, Phaera is gone, and you are standing where you fell."),
        __("The battle is long over, though you cannot remember why you fought.  A robbery?  Defending your honour?  Regardless, it hardly seems to matter now."),
        __("Lacking direction, you begin walking.  Eventually, you encounter a small family with what looks like their entire belongings packed into a small cart."),
        __("They explain that they are fleeing, and warn you to do the same."),
        __("\"Tyrose hasn't been the same since that *Green Dragon* took up in the *Forest* nearby, stealing livestock and treasure and killing any who seek it,\" the matriarch warns you."),
        __("You smile and thank her, and head toward the town."),
      ];
      for (let idx = 0; idx < story.length; idx++) {
        character.slashbot.say(story[idx], narratorChar, { messageDelay: idx * 5, typing: true });
      }

      let basicHelp = "Welcome to Chat & Slash.  All your actions are controlled through buttons here in your private channel.\n\nYou can take up to 10 significant Actions, using up 1 AP each, before needing to rest for a bit.  AP comes back at the rate of 1 every 15 minutes, so you'll have ample time to get actual work done without worrying about falling behind.\n\nIf you are ever stuck, type \"/chatandslash\" for some hints, and be sure to visit the forum at http://forum.chatandslash.com/ to meet and greet other players.";

      // Add test server text
      if ('public-test' === process.env.MODE) {
        basicHelp += "\n\nThank you for participating in the Chat & Slash Test!  If you have any feedback (bugs, questions, comments, _anything_), please feel free to bring it up in the #feedback channel.";
      }

      // Give basic game help
      character.slashbot.say(
        basicHelp,
        narratorChar,
        {
          attachments: Attachments.one({
            title: __('Begin your quest:'),
            actions: Actions.oneButton(__("Head into town"), "continue")
          }),
          messageDelay: story.length * 5
        }
      );
    }
  }
}

module.exports = IntroCommand;