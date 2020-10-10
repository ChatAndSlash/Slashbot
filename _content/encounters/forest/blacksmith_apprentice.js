"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME  = 'forest-blacksmith_apprentice';
const ACTION_SAVE_HIM = 'save_him';

/**
 * Stumble upon a cowardly apprentice.
 */
class BlacksmithApprenticeEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __('Suddenly, you\'re stunned by a young man who jumps out at you from around a bend.  You reach for your weapon, but he falls to his knees.  "Save me!" he begs.  "Save me from the terrible beast!"  Behind him you can see a very upset squirrel, chittering and pacing back and forth.'),
      actions: Actions.oneButton(__('"Save" him'), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_SAVE_HIM } })
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
    return 'encounters/tyrose/apprentice.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Cowardly Apprentice");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_SAVE_HIM !== action) {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    const titleTemplate = 'Sighing, you shoo away the squirrel.  The young man thanks you profusely, and offers you a small bag of gold.  "You really should come see me at the blacksmith in town!  Jack, my master, can make you all kinds of things to help keep you safe from wild beasts like these!"\n\nYou gain %d gold.';

    // Ensure player has L2 weapon and armour or gets enough gold to upgrade to them
    let gold = 0;
    if (character.armour.type === 'equipment-armour-001_clothes') {
      gold += 20;
    }
    if (character.weapon.type === 'equipment-weapons-001_pine_club') {
      gold += 30;
    }
    // Top them up to just enough to buy missing items
    gold -= character.gold;

    // Give at least 10 gold
    gold = Math.max(gold, 10);
    character.gold += gold;

    character.track('Find Apprentice');

    character.setStat(STATS.RESCUED_APPRENTICE);
    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({  title: __(titleTemplate, gold) }),
      doLook: true
    });
  }
}

module.exports = BlacksmithApprenticeEncounter;