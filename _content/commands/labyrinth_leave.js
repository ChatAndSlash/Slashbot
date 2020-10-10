"use strict";

const Command     = require('@app/content/commands').Command;
const Attachments = require('slacksimple').Attachments;
const Locations   = require('@app/content/locations').Locations;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

/**
 * Leave the labyrinth.
 */
class LeaveLabyrinthCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const newCompleted = Math.floor(character.getFlag(FLAGS.HALLWAYS_COMPLETED) / 5) * 5;
    character.clearFlag(FLAGS.HALLWAY_CHOICES);
    character.clearFlag(FLAGS.HALLWAY_REMAINING);
    character.setFlag(FLAGS.HALLWAYS_COMPLETED, newCompleted);
    character.location = Locations.new('watermoon-scholar-quad');
    character.state = CHARACTER_STATE.IDLE;

    let crossroadsName = newCompleted > 0 ? __("crossroads #%d", newCompleted) : __("the first crossroads");
    await this.updateLast({
      attachments: Attachments.one({ title: __("You make your way out of the Labyrinth to the Scholar Quad, knowing you can always find your way back to %s.", crossroadsName) }),
      doLook: true
    });
  }
}

module.exports = LeaveLabyrinthCommand;