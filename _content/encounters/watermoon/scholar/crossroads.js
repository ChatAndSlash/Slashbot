"use strict";

const Actions     = require('slacksimple').Actions;
const Encounter   = require('@app/content/encounters').Encounter;
const Attachments = require('slacksimple').Attachments;
const Random      = require('@util/random');
const ordinal     = require('ordinal');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;
const COLORS          = require('@constants').COLORS;

const ENCOUNTER_NAME = 'watermoon-scholar-crossroads';
const ACTION_CHOOSE  = 'choose';
const ACTION_CLUE    = 'clue';

const TYPE_CLUE = 'quest-watermoon-clue';

const HALLWAYS = [
  { 'weight': 10, value: 'watermoon-scholar-hallway-shortcut' },
  { 'weight': 14, value: 'watermoon-scholar-hallway-detour' },
  { 'weight': 20, value: 'watermoon-scholar-hallway-dark' },
  { 'weight': 10, value: 'watermoon-scholar-hallway-easy' },
  { 'weight': 10, value: 'watermoon-scholar-hallway-hard' },
  { 'weight': 10, value: 'watermoon-scholar-hallway-tricky' },
  { 'weight': 5,  value: 'watermoon-scholar-hallway-shiny' },
  { 'weight': 1,  value: 'watermoon-scholar-hallway-glowing' },
  { 'weight': 5,  value: 'watermoon-scholar-hallway-barren' },
  { 'weight': 5,  value: 'watermoon-scholar-hallway-foul' },
  { 'weight': 5,  value: 'watermoon-scholar-hallway-icy' },
  { 'weight': 5,  value: 'watermoon-scholar-hallway-null' },
];

/**
 * Crossroads in the Scholar Labyrinth.
 */
class CrossroadsEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
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
    return 'encounters/watermoon/crossroads.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotName(character) {
    const completed = character.getFlag(FLAGS.HALLWAYS_COMPLETED);
    return completed > 0 ? __("Labyrinth Crossroads #%d", completed) : __("Labyrinth, First Crossroads");
  }

  /**
   * Gets the description for this location.
   *
   * @param {Character} character - The character getting the description.
   *
   * @return {string}
   */
  getDescription(character) {
    const completed = character.getFlag(FLAGS.HALLWAYS_COMPLETED);

    return __("You are standing at the %s intersection in the Labyrinth, with three paths leading into three hallways.  Each path is marked with cryptic symbols that could potentially decyphered if only one had the means to do so.  Perhaps some research at the nearby Library would bear fruit?", ordinal(completed + 1));
  }

  /**
   * Get the actions for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();
    let knownCount = 0;

    const choices = this.getHallwayChoices(character);
    for (let hallwayIndex = 0; hallwayIndex < choices.length; hallwayIndex++) {
      actions.addAction(this.getHallwayButton(choices[hallwayIndex], hallwayIndex, character));
      knownCount += choices[hallwayIndex].known ? 1 : 0;
    }

    actions.addAction(this.getUseClueButton(knownCount, character));
    actions.addAction(character.location.getLeaveLabyrinthButton(character));

    return actions;
  }

  /**
   * Create a button for the provided hallway.
   *
   * @param {object} choice - The hallway choice information.
   * @param {integer} index - The index of the hallway choice.
   * @param {Character} character - The character considering the hallway choice.
   *
   * @return {object}
   */
  getHallwayButton(choice, index, character) {
    const Locations = require('@app/content/locations').Locations;
    const hallway = Locations.new(choice.type);
    const name = choice.known ? hallway.getDisplayName(character) : __("Mysterious Hallway");

    return Actions.getButton(name, "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CHOOSE, hallway: index } } );
  }

  /**
   * Creates a button for using clues.
   *
   * @param {integer} knownCount - The count of known hallways.
   * @param {Character} character - The character considering using a clue.
   *
   * @return {object}
   */
  getUseClueButton(knownCount, character) {
    const style = (knownCount < 3  && character.inventory.has(TYPE_CLUE))
      ? 'default'
      : 'danger';

    return Actions.getButton(__("Use a Clue"), "encounter", {
      params: {
        type: ENCOUNTER_NAME,
        action: ACTION_CLUE
      },
      style
    });
  }

  /**
   * Get the hallway choices facing this character.
   *
   * @param {Character} character - The character to get hallway choices for.
   *
   * @return {object}
   */
  getHallwayChoices(character) {
    // If character doesn't have any choices yet, create them
    if ( ! character.hasFlag(FLAGS.HALLWAY_CHOICES)) {
      let choices = [];
      choices.push({ type: Random.getWeighted(HALLWAYS), known: false });
      choices.push({ type: Random.getWeighted(HALLWAYS), known: false });
      choices.push({ type: Random.getWeighted(HALLWAYS), known: false });

      character.setFlag(FLAGS.HALLWAY_CHOICES, choices);
    }

    return character.getFlag(FLAGS.HALLWAY_CHOICES);
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_CHOOSE === action) {
      await this.chooseHallway(this.info.hallway, character);
    }
    else if (ACTION_CLUE === action) {
      await this.useClue(character);
    }
    else {
      throw new Error(`Unknown action: ${action}.`);
    }
  }

  /**
   * Use a clue to reveal a hallway.
   *
   * @param {Character} character - The character using a clue.
   */
  async useClue(character) {
    if ( ! character.inventory.has(TYPE_CLUE)) {
      await this.updateLast({
        attachments: Attachments.one({
          title: __("You don't have any clues to use."),
          color: COLORS.WARNING
        }),
        doLook: true
      });
      return;
    }

    let clueUsed = false;
    const choices = character.getFlag(FLAGS.HALLWAY_CHOICES);
    for (let choice of choices) {
      if ( ! choice.known) {
        choice.known = true;
        clueUsed = true;
        break;
      }
    }

    if ( ! clueUsed) {
      await this.updateLast({
        attachments: Attachments.one({
          title: __("There are no more hallways that need identifying."),
          color: COLORS.WARNING
        }),
        doLook: true
      });
      return;
    }

    character.setFlag(FLAGS.HALLWAY_CHOICES, choices);
    character.inventory.remove(TYPE_CLUE);

    await this.updateLast({
      attachments: Attachments.one({ title: __("You consult one of your Clues and use it to determine the character of one of the hallways before you.  Its secrets revealed to you, you discard the now-worthless Clue.") }),
      doLook: true
    });
  }

  /**
   * Choose a hallway to travel down.
   *
   * @param {integer} hallwayIndex - The chosen hallway.
   * @param {Character} character - The character choosing the hallway.
   */
  async chooseHallway(hallwayIndex, character) {
    const Locations = require('@app/content/locations').Locations;
    const choice = character.getFlag(FLAGS.HALLWAY_CHOICES)[hallwayIndex];
    const hallway = Locations.new(choice.type);

    character.state = CHARACTER_STATE.IDLE;
    character.location = hallway;
    character.setFlag(FLAGS.HALLWAY_REMAINING, hallway.getLength());
    character.clearFlag(FLAGS.HALLWAY_CHOICES);

    const title = choice.known
      ? __("You set out down the %s.", hallway.getDisplayName(character))
      : __("With trepidation, you set out, to discover you are travelling down a %s.", hallway.getDisplayName());

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = CrossroadsEncounter;