"use strict";

const Command     = require('@app/content/commands').Command;
const Encounters  = require('@app/content/encounters').Encounters;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

/**
 * Enter the labyrinth!
 */
class EnterLabyrinthCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    let title;

    // Move the character to a hallway so that hallway functions will work.
    const Locations = require('@app/content/locations').Locations;
    character.location = Locations.new('watermoon-scholar-hallway-hard');

    if (this.isAtBoss(character)) {
      let bossType;

      if (character.getFlag(FLAGS.HALLWAYS_COMPLETED) < 40 || ! character.hasKilledBlackDragon()) {
        bossType = character.location.chooseBoss(character.getFlag(FLAGS.HALLWAYS_COMPLETED));
      }
      else {
        bossType = character.getFlag(FLAGS.SCHOLAR_BOSS);
      }

      character.enemy = character.location.buildEnemy(character, bossType);
      character.state = CHARACTER_STATE.FIGHTING;
      title = __(":white_check_mark: You head into the Labyrinth to confront the %s!", character.enemy.getDisplayName(character));
    }
    else {
      character.encounter = Encounters.new('watermoon-scholar-crossroads');
      character.encounter.setMessageInfo(
        character,
        this.info,
        this.message
      );
      character.state = CHARACTER_STATE.ENCOUNTER;
      title = __(":white_check_mark: You enter the halls of the Labyrinth.");
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Determine if the character is at a boss, or just heading to a hallway checkpoint.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {boolean}
   */
  isAtBoss(character) {
    const completed = character.getFlag(FLAGS.HALLWAYS_COMPLETED);
    if (completed && completed % 10 === 0) {
      const bossType = character.location.chooseBoss(character.getFlag(FLAGS.HALLWAYS_COMPLETED));
      return ! character.hasFlag(FLAGS.BOSS_DEFEATED_ + bossType);
    }

    return false;
  }
}

module.exports = EnterLabyrinthCommand;