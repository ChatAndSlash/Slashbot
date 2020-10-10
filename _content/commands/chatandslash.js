"use strict";

const Command = require('@app/content/commands').Command;

/**
 * Get some basic information.
 */
class ChatAndSlashCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;

    let instructions = "Control your character by clicking on the provided buttons.  In addition, you can get information about your character and the world with the following commands:```";
    instructions += "/character: Get detailed information about your character.\n";
    if (character.level >= 3) {
      instructions += "/cast: Cast a spell that you know.\n";
    }
    instructions += "/equip: Equip a piece of equipment from your inventory.\n";
    instructions += "/examine [item]: Examine an item in your inventory.\n";
    instructions += "/look: Redisplay the text and buttons for your location.\n";
    instructions += "```\n";
    instructions += "Still looking for some help or have some feedback?  Email admin@chatandslash.com or check out the forums at http://forum.chatandslash.com/";

    character.slashbot.say(instructions, character);
    await this.doLook();
  }
}

module.exports = ChatAndSlashCommand;