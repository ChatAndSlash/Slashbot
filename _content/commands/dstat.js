"use strict";

const DevCommand = require('@app/content/commands').DevCommand;

const STATS = require('@constants').STATS;

/**
 * Set or clear a stat.
 * (Developer command!)
 */
class DeveloperStatCommand extends DevCommand {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.text.split(' ').length === 4) {
      return await this.sayError(`To set stat subtypes, use the format: "stat.subType".`);
    }

    const character = this.character;
    const [cmd, longStat, value] = this.info.text.split(' ');
    let stat, subType;

    if (longStat.includes(".")) {
      [stat, subType] = longStat.split(".");
    }
    else {
      stat = longStat;
      subType = "";
    }

    if ( ! ['set', 'clear'].includes(cmd)) {
      return await this.sayError(`${cmd} is not a valid command.`);
    }

    if ( ! Object.values(STATS).includes(stat)) {
      return await this.sayError(`${stat} is not a valid stat.`);
    }

    if ('set' === cmd) {
      const setValue = _.isUndefined(value) ? 1 : value;
      character.setStat(stat, setValue, subType);
      character.slashbot.say(`:hammer_and_wrench: Set stat \`${longStat}\` to \`${setValue}\`.`, character);
    }
    else {
      character.setStat(stat, 0, subType);
      character.slashbot.say(`:hammer_and_wrench: Cleared stat \`${longStat}\`.`, character);
    }

    await this.doLook();
  }
}

module.exports = DeveloperStatCommand;