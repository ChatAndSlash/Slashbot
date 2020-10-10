"use strict";

const Command     = require('@app/content/commands').Command;
const Attachments = require('slacksimple').Attachments;

const Random = require('@util/random');

const COLORS          = require('@constants').COLORS;
const FLAGS           = require('@constants').FLAGS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STD_DELAY       = require('@constants').STD_DELAY;
const STATS           = require('@constants').STATS;
/**
 * Explore in an area with encounters.
 */
class ExploreCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    let info = { color: COLORS.WARNING, delay: STD_DELAY };

    // If not enough Action Points to explore
    if (character.ap === 0) {
      this.updateLast({
        attachments: Attachments.one({
          title: __(":warning: You don't have enough Action Points to explore.  Consider waiting a while.  You'll recover 1 AP every fifteen minutes, and can then continue exploring."),
          color: COLORS.DANGER,
        }),
      });
      // But if they DO have enough AP, let's do this!
    }
    else {

      this.character.increaseStat(STATS.AP_SPENT, 1);

      if ('true' !== _.get(process.env, 'INFINITE_AP', 'false')) {
        character.ap--;
      }
      character.location.chooseEncounter(character, this.message);

      // If fighting in the dark, a chance to be surprised
      const light = character.location.getLight(character);
      if (character.state === CHARACTER_STATE.FIGHTING && light < 100) {

        // Light source?  You're safe!
        if (character.hasLightSource()) {
          info.extraText = character.consumeLightSource();

          // No light source?  You might be surprised, then!
        }
        else {
          // The less light, the more chance of surprise
          if (Random.between(1, 100) > light) {
            // Surprised!  Send a message and be stunned for 1 round
            info.extraText = __("\n\n*%s sneaks up out of the darkness and surprises you.*\nYou are stunned for one round!\n_You should probably find some light._", character.enemy.getDisplayName(character));
            character.setFlag(FLAGS.STUNNED_TURNS, 1);
            // If not surprised, send message saying you COULD be.
          }
          else {
            info.extraText = __("\n\nIt's so dark, you almost didn't notice %s sneaking up on you!\n_You should find some light!_", character.enemy.getDisplayName(character));
          }
        }
      }
    }

    await this.doLook({ info });
  }
}

module.exports = ExploreCommand;