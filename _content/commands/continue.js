"use strict";

const Command     = require('@app/content/commands').Command;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

/**
 * Continue on from a cutscene.
 */
class ContinueCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    this.character.clearFlag(FLAGS.IN_CUTSCENE);
    this.character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title: __(":white_check_mark: Got it!") }),
      doLook: true
    });
  }
}

module.exports = ContinueCommand;