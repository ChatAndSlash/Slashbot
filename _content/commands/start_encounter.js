"use strict";

const Command     = require('@app/content/commands').Command;
const Encounters  = require('@app/content/encounters').Encounters;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

/**
 * Begin an encounter.
 */
class StartEncounterCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;

    character.encounter = Encounters.new(this.info.type);
    character.encounter.setMessageInfo(
      character,
      this.info,
      this.message
    );
    await character.encounter.loadExtra(character);

    character.state = CHARACTER_STATE.ENCOUNTER;

    await this.updateLast({
      attachments: Attachments.one({ title: __(":white_check_mark: Got it!") }),
      doLook: true
    });
  }
}

module.exports = StartEncounterCommand;