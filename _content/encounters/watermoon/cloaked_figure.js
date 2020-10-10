"use strict";

const { Encounter }   = require('@app/content/encounters');
const { Actions, Attachments } = require('slacksimple');
const { toWords } = require('number-to-words');

const {
  FLAGS,
  CHARACTER_STATE,
  COLORS,
  LYSTONE_CHIP_MAX
} = require('@constants');

const COMPLETED_CHIP_COUNT = 10;

const ENCOUNTER_NAME  = 'watermoon-cloaked_figure';
const ACTION_APPROACH = 'approach';
const ACTION_LEAVE    = 'leave';
const ACTION_TAKE_IT  = 'take_it';

/**
 * Cloaked Figure.
 */
class CloakedFigureEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Image of the fortune teller.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/watermoon/cloaked_figure.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return character.location.getLystoneChipCount(character) == COMPLETED_CHIP_COUNT
      ? ": Lyca Trainer"
      : ": Cloaked Figure";
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    return character.location.getLystoneChipCount(character) == COMPLETED_CHIP_COUNT
      ? "The Lyca Trainer stands by the fountain, the hood from their cloak thrown back, revealing grinning canine features.  Their fur is damp from the spray of the fountain, but they don't seem to care."
      : "The Cloaked Figure stands by the fountain, their cloak slightly damp from the fountain spray.  They hunch over with their hood falling over their face, so that you can't make out any of their features.";
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

    const chipCount = character.location.getLystoneChipCount(character);
    if (chipCount === COMPLETED_CHIP_COUNT) {
      actions.addButton("Train", "train");
    }
    else {
      actions.addButton("Approach", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_APPROACH } } );
    }

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
    if (ACTION_APPROACH === action) {
      await this.approach(character, message);
    }
    else if (ACTION_LEAVE === action) {
      await this.leave(character, message);
    }
    else if (ACTION_TAKE_IT === action) {
      await this.takeIt(character, message);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }
  }

  /**
   * Approach the Cloaked Figure.
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async approach(character, message) {
    let title = '';
    const chipCount = character.location.getLystoneChipCount(character);

    if (chipCount >= LYSTONE_CHIP_MAX) {
      const description = "The Cloaked Figure straightens up and looks at you, revealing the face of a wolf.  \"You are ready, but your Lystone is not.\"\n\nYou ponder for a moment, until they reach forward and points to a hairline chip you hadn't noticed before, their clawed finger tapping gently against it.  Before you can process the fact that their furred hands have claws, they turn their hand over and open it, revealing a tiny chip glittering there.\n\n\"Take it,\" they say.";

      let attachments = new Attachments().add({
        title: "What do you do?",
        fields: character.getFields(),
        color: COLORS.INFO
      });
      attachments.addButton("Take it", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_TAKE_IT } } );

      return await this.updateLast({ description, attachments });
    }
    else if (chipCount === 0) {
      title = "The Cloaked Figure growls as you approach.  \"You are nowhere near ready.  Work to complete your Lystone, then return to me.\"\n\nYou leave, heading off to collect more Lystone chips.";
    }
    // 7,8
    else if (chipCount > 6) {
      title = `The Cloaked Figure yips excitedly as you approach.  "You are nearly done your quest.  Only ${toWords(LYSTONE_CHIP_MAX - chipCount)} chips remain in your quest."\n\nYou leave to collect the final Lystone chips.`;
    }
    // 4,5,6
    else if (chipCount > 3) {
      title = `The Cloaked Figure sniffs carefully as you approach.  "You are making progress.  Though you still have ${toWords(LYSTONE_CHIP_MAX - chipCount)} chips remaining before your task is done."\n\nYou head out to collect more Lystone chips.`;
    }
    // 1,2,3
    else {
      title = `The Cloaked Figure regards you quietly, their face remaining in shadow.  "Hm, it seems you may be worthy of this quest.  Return to me when you have collected ${toWords(LYSTONE_CHIP_MAX - chipCount)} more Lystone chips."\n\nYou leave, smiling, and vowing to collect the rest of the Lystone chips.`;
    }

    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Maybe don't approach.
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async leave(character, message) {
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({
        title: "You leave the Cloaked Figure alone.  As you leave, you can't shake the feeling you smell wet dog...",
      }),
      doLook: true
    });
  }

  /**
   * Take the final chip.
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async takeIt(character, message) {
    const title = "You take the tiny chip and hold it to your Lystone, which instantly fuses with it and begins to brightly glow!  The hooked figure raises his head, grinning at you with the face of a wolf.  \"Now, you are ready.\"";
    character.incrementFlag(FLAGS.LYSTONE_CHIP_COUNT);

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = CloakedFigureEncounter;
