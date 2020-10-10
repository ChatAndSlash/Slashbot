"use strict";

const Command     = require('@app/content/commands').Command;
const Locations   = require('@app/content/locations').Locations;
const Attachments = require('slacksimple').Attachments;

const FLAGS = require('@constants').FLAGS;

/**
 * Travel from one location to another.
 */
class TravelCommand extends Command {
  /**
   * Execute the command.
   *
   * @param {function} done - A function to call when done.
   */
  async execute() {
    let title = '';

    if (this.character.canTravelTo(this.info.to)) {
      const location = Locations.new(this.info.to);
      const costText = this.getCostText(location);

      title = __(":white_check_mark: You%s travelled to %s.", costText, location.getDisplayName(this.character));

      title += await location.onTravelTo(this.character);

      this.character.location = location;
    }
    else {
      title = this.character.getTravelErrorMessage(this.info.to);
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Get the text for travelling to a location, if any.
   *
   * @param {Location} location - The location being traveled to.
   *
   * @return {string}
   */
  getCostText(location) {
    let costText = "";

    if (location.travelCost) {
      costText = __(" spent %d AP and", location.travelCost);
      this.character.ap -= location.travelCost;

      if (this.character.hasFlag(FLAGS.CHEST_CURSE_FRAILTY)) {
        this.character.decrementFlag(FLAGS.CHEST_CURSE_FRAILTY);
      }

      if (this.character.hasFlag(FLAGS.CHEST_CURSE_CLUMSY)) {
        this.character.decrementFlag(FLAGS.CHEST_CURSE_CLUMSY);
      }
    }

    return costText;
  }
}

module.exports = TravelCommand;