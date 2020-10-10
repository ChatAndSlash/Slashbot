"use strict";

const Command       = require('@app/content/commands').Command;
const Attachments   = require('slacksimple').Attachments;
const TeleportSpell = require('@content/spells/teleport');
const Locations     = require('@app/content/locations').Locations;

/**
 * Magically teleport to a location.
 */
class TeleportCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const location = Locations.new(this.info.location);
    const spell = new TeleportSpell();

    let title = `:comet: A blue light swirls around you and you're whisked into the air!  Seconds later, you find yourself gently deposited at ${location.getDisplayName(character)}.`;
    title += await location.onTravelTo(character);

    character.location = location;
    character.mp -= spell.getMpCost(character);

    await this.updateLast({
      attachments: Attachments.one({ title }),
    });

    await this.doLook();
  }
}

module.exports = TeleportCommand;