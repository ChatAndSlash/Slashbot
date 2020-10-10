"use strict";

const Command     = require('@app/content/commands').Command;
const Attachments = require('slacksimple').Attachments;

const COLORS = require('@constants').COLORS;

/**
 * Perform an action in the Mystic Planes.
 */
class PlaneActionCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === 'direction') {
      this.changeDirection();
    }
    else if (this.info.action === 'dowse') {
      this.dowse();
    }
  }

  /**
   * Change the direction you're facing.
   */
  async changeDirection() {
    const character = this.character;

    character.location.changeDirection(character, this.info.direction);

    await this.updateLast({
      attachments: Attachments.one({
        title: __("You begin travelling to the %s.", __(this.info.direction)),
        color: COLORS.GOOD,
      }),
      doLook: true
    });
  }

  /**
   * Identify N/S, E/W, or rough distance.
   */
  async dowse() {
    const character = this.character;

    let title = "";
    let color = COLORS.PROPHECY;

    if (character.ap > 0) {
      title = character.location.dowse(character);
      if ('true' !== _.get(process.env, 'INFINITE_AP', 'false')) {
        character.ap--;
      }
    }
    else {
      title = __(":warning: You don't have enough Action Points to dowse.  Consider waiting a while.  You'll recover 1 AP every fifteen minutes, and can then continue playing.");
      color = COLORS.DANGER;
    }

    await this.updateLast({
      attachments: Attachments.one({ title, color }),
      doLook: true
    });
  }
}

module.exports = PlaneActionCommand;