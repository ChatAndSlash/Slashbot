"use strict";

const DevCommand = require('@app/content/commands').DevCommand;

/**
 * Reset a character.
 * (Developer command!)
 */
class DeveloperNewGameCommand extends DevCommand {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const slashbot  = character.slashbot;
    const payload = {
      uid: character.uid,
      teamid: character.teamid,
      name: character.getDisplayName(),
      email: character.email,
      channel: character.channel
    };

    if ('confirm' !== this.info.text) {
      return await this.sayError('You must confirm this action!');
    }

    const connection = await DB_POOL.getConnection();

    await connection.query('DELETE FROM characters WHERE uid = ?', [character.uid]);
    connection.release();

    slashbot.say(`:hammer_and_wrench: Started a new game.`, character);

    await slashbot.onNewGame(payload, character.queueSuffix, false);

    const newCharacter = await slashbot.getLoadedCharacter({
      uid: character.uid,
      teamid: character.teamid,
    });
    await this.doLook({ newCharacter });
  }
}

module.exports = DeveloperNewGameCommand;