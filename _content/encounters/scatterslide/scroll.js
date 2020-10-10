"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Spells      = require('@app/content/spells').Spells;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ENCOUNTER_NAME = 'scatterslide-scroll';
const ACTION_READ_IT = 'read_it';

/**
 * A pile of stones that can be looked through for good blocks.
 */
class StonePileEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("Something makes a crumpling noise as you tread along.  You look down and see that you've stepped on a piece of paper that was discarded long ago.  Glancing briefly at it, you can tell that it's covered in detailed magical instructions.  It's a new spell!"),
      actions: Actions.oneButton(__("Read it"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_READ_IT } } ),
    });
  }

  /**
   * Image of the stone pile.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/scatterslide/scroll.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Scroll");
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
    let spell = null;

    character.state = CHARACTER_STATE.IDLE;

    if (character.location.type === 'scatterslide-mine') {
      spell = Spells.new('open_wounds');
    }
    else if (character.location.type === 'scatterslide-underdrift') {
      spell = Spells.new('poison_cloud');
    }
    else {
      throw new Error("No spell scroll for location ${character.location.type}.");
    }

    if (ACTION_READ_IT === action) {
      character.learnSpell(spell.type);
      title = __("You read the scroll, learning a new spell: %s.  Once you've read it, the letters on the scroll fade away to nothing, and you discard the now-worthless paper.", spell.getDisplayName(character));
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = StonePileEncounter;