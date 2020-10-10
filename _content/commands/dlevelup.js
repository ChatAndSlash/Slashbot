"use strict";

const DevCommand = require('@app/content/commands').DevCommand;

/**
 * Level up a character.
 * (Developer command!)
 */
class DeveloperLevelUpCommand extends DevCommand {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const levels = this.info.text ? this.info.text : 1;

    let responses = [];
    for (let i = 0; i < levels; i++) {
      responses.push(character.addXp(character.getRequiredToNextLevel()));
    }

    const responseText = responses.join(" ");
    character.slashbot.say(`:hammer_and_wrench: Leveled up ${levels} times.\n${responseText}`, character);
    await this.doLook();
  }
}

module.exports = DeveloperLevelUpCommand;