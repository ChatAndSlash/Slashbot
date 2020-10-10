"use strict";

const Command = require('@app/content/commands').Command;

/**
 * Perform an encounter action.
 */
class EncounterCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;

    character.encounter.setMessageInfo(
      this.character,
      this.info,
      this.message,
      this.triggerId,
    );
    await character.encounter.doAction(this.info.action, character, this.message);
  }
}

module.exports = EncounterCommand;