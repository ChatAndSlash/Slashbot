"use strict";

const DevCommand = require('@app/content/commands').DevCommand;

/**
 * Heal character to full.
 * (Developer command!)
 */
class DeveloperHealCommand extends DevCommand {
  /**
   * Execute the command.
   *
   * @param {function} done - A function to call when done.
   */
  async execute() {
    this.character._hp = this.character.maxHp;
    this.character._mp = this.character.maxMp;

    this.character.slashbot.say(':hammer_and_wrench: Healed to full.', this.character);
    await this.doLook();
  }
}

module.exports = DeveloperHealCommand;