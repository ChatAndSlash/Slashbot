"use strict";

const DevCommand = require('@app/content/commands').DevCommand;
const Items      = require('@app/content/items').Items;

/**
 * Give stuff to a player.
 * (Developer command!)
 */
class DeveloperGiveCommand extends DevCommand {
  /**
   * Execute the command.
   *
   */
  async execute() {
    const character = this.character;
    const slashbot = character.slashbot;
    const [amount, item] = this.info.text.split(' ');

    if (Object.keys(Items.all()).includes(item)) {
      character.inventory.add(item, amount);
      slashbot.say(`:hammer_and_wrench: Added \`${amount} ${item}\`.`, character);
    }
    else if ('xp' === item) {
      character.addXp(amount);
      slashbot.say(`:hammer_and_wrench: Added \`${amount}\` XP.`, character);
    }
    else if ('sp' === item) {
      const earnedSp  = character.profession.sp + character.profession.spSpent;
      const allowedSp = character.profession.maxSp - earnedSp;
      const added = Math.min(amount, allowedSp);

      character.profession.sp += parseInt(added);
      slashbot.say(`:hammer_and_wrench: Added \`${added}\` SP.`, character);
    }
    else if ('gold' === item) {
      character.gold += parseInt(amount);
      slashbot.say(`:hammer_and_wrench: Added \`${amount}\` gold.`, character);
    }
    else if ('scales' === item) {
      character.scales += parseInt(amount);
      slashbot.say(`:hammer_and_wrench: Added \`${amount}\` scales.`, character);
    }
    else {
      return await this.sayError(`Invalid item: ${item}.`);
    }

    await this.doLook();
  }
}

module.exports = DeveloperGiveCommand;