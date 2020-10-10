"use strict";

let collection = {};
let names      = {};

const Files   = require('@util/files');
const Content = require('@app/content')(collection, names);

const STD_DELAY = require('@constants').STD_DELAY;

class Command {
  /**
   * Initialize command.
   *
   * @param {Character} character - The character executing the command.
   * @param {object} info - The command information.
   * @param {object} message - The message this command originated from.
   * @param {string} triggerId - The trigger ID of this message.
   */
  constructor(character, { info = {}, message = {}, triggerId } = {}) {
    this.character = character;
    this.info      = info;
    this.message   = message;
    this.triggerId = triggerId;
  }

  /**
   * Execute the command.
   */
  async execute() { }

  /**
   * Update the last message sent.
   *
   * @param {string} description - The description to update the message with.
   * @param {Character} character - The character to update the message with.
   * @param {attachments} Attachments - A collection of attachments to update the message with.
   * @param {boolean} doLook - If we should append a look command after updating this message.
   */
  async updateLast({
    description = this.message.text,
    character = this.character,
    attachments = this.message.attachments,
    doLook = false,
  } = {}) {

    character.slashbot.update(this.message, description, character, attachments);

    if (doLook) {
      await this.doLook();
    }
  }

  /**
   * Perform a look action after delaying.
   *
   * @param {Character} character - The character looking.
   * @param {float} delay - The # of seconds to delay.
   * @param {object} info - Extra info to add.
   */
  async doLook({
    character = this.character,
    delay = STD_DELAY,
    info = {}
  } = {}) {
    if (_.isUndefined(info.delay)) {
      info.delay = delay;
    }

    const Commands = require('@app/content/commands').Commands;
    const command = Commands.new('look', character, { info });
    await command.execute(() => {});
  }
}

/**
 * Developer command.
 */
class DevCommand extends Command {
  /**
   * Ya messed up!
   *
   * @param {string} text - The error text.
   */
  async sayError(text) {
    this.character.slashbot.say(`:exclamation: ${text}`, this.character);
    await this.doLook();
  }
}

/**
 * Utility class for searching and creating new command objects.
 */
class Commands extends Content {}

module.exports = {
  Command,
  DevCommand,
  Commands
};

/**
 * @type array The collection of commands.
 */
Files.loadContent(`${CONTENT_FILES_PATH}/commands/`, `${CONTENT_FILES_PATH}/commands/`, collection);