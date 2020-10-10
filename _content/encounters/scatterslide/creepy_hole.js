"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STD_DELAY       = require('@constants').STD_DELAY;

const ENCOUNTER_NAME = "scatterslide-creepy_hole";
const ACTION_YES     = "yes";
const ACTION_NO      = "no";

const GOLD_REWARD = 35;

/**
 * Encounter a creepy hole in the wall.
 */
class CreepyHoleEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("Yes..."), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_YES } });
    actions.addButton(__("Hell no!"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_NO } });

    super({
      type: ENCOUNTER_NAME,
      description: __("As you walk down the dark passages of the Underdrift, you notice a flow of warmer air, which you follow until it leads you to a hole in the wall from which it seems to issue.  It's a rather long hole, about arm-length deep, but at the end of it is something that glints at you despite the lack of light that should be able to reach."),
      title: __("Will you put your arm in the hole?"),
      actions
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
    return 'encounters/scatterslide/creepy_hole.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Creepy Hole");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let title = '';

    if (ACTION_YES === action) {
      character.gold += GOLD_REWARD;

      title = __("You reach in, your arm almost not long enough to reach the back.  You lean hard into the hole, pressing your body against the wall to get those final few inches of reach, and manage to use the tips of your fingers to scrape a small box close enough that you can grab it fully.\n\nAs you withdraw your hand from the wall, you can feel something slimy and strong briefly grasp your hand.  Startled, you snap your arm back and manage to withdraw the box with it.  A low, gutteral growl issues from the hole, and hot air starts coming from the hole in bursts, accompanield by a panting noise.\n\nWisely, you book it until the hole is well behind you.  Sighing, you open the small box, and pull out %d gold.  Was it really worth it?",GOLD_REWARD);
    }
    else if (ACTION_NO === action) {
      title = __("You nope the hell out of there as quickly as you can.");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.setStat(STATS.CREEPY_HOLE);
    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Cast a spell that may affect this encounter.
   *
   * @param {Spell} spell - The spell being cast.
   * @param {Character} character - The character casting the spell.
   */
  castSpell(spell, character) {
    if ("scry" === spell.type) {
      character.setStat(STATS.CAVE_LOCKED_BOX);
      character.state = CHARACTER_STATE.IDLE;

      character.gold += GOLD_REWARD;

      character.slashbot.say(__("*You concentrate on the future, and receive a vision of yourself being poisoned by a glass vial you accidentally smash when you carelessly smash open this box.  Carefully, you break the part of the box that doesn't have the glass vial in it, and retrieve %d gold without injuring yourself.*", GOLD_REWARD), character);
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
    }
    else {
      super.castSpell(spell, character);
    }
  }
}

module.exports = CreepyHoleEncounter;