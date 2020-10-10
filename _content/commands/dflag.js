"use strict";

const DevCommand = require('@app/content/commands').DevCommand;

const FLAGS = require('@constants').FLAGS;

/**
 * Set or clear a flag.
 * (Developer command!)
 */
class DeveloperFlagCommand extends DevCommand {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const [cmd, flag, value] = this.info.text.split(' ');

    if ( ! ['set', 'clear'].includes(cmd)) {
      return await this.sayError(`${cmd} is not a valid command.`);
    }

    if ( ! Object.values(FLAGS).includes(flag)) {
      return await this.sayError(`${flag} is not a valid flag.`);
    }

    if ('set' === cmd) {
      const setValue = _.isUndefined(value) ? 1 : value;
      character.setFlag(flag, setValue);
      character.slashbot.say(`:hammer_and_wrench: Set flag \`${flag}\` to \`${setValue}\`.`, character);
    }
    else {
      character.clearFlag(flag);
      character.slashbot.say(`:hammer_and_wrench: Cleared flag \`${flag}\`.`, character);
    }

    await this.doLook();
  }
}

module.exports = DeveloperFlagCommand;