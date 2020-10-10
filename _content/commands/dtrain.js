"use strict";

const DevCommand = require('@app/content/commands').DevCommand;

const STATS = require('@constants').STATS;

/**
 * Fully train the current profession.
 * (Developer command!)
 */
class DeveloperTrainCommand extends DevCommand {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;

    await this.train(character, character.profession);

    character.slashbot.say(":dark_sunglasses: Profession stats, skills, and mastery have been trained.", character);

    await this.doLook();
  }

  /**
   * Train a profession fully.
   *
   * @param {Character} character - The character training the profession.
   * @param {Profession} profession - The profession being trained.
   */
  async train(character, profession) {
    const privateStats = [
      'maxHp',
      'force',
      'technique',
      'defence',
      'spellPower',
    ];

    const stats = profession.getStats();
    for (const type in stats) {
      const stat = stats[type];
      if ( ! character._isLoading) {
        const increaseType = privateStats.includes(type) ? `_${type}` : type;
        character[increaseType] += (stat.increase * stat.costs.length);
      }
      profession.trained[type] = stat.costs.length;
    }

    const skills = profession.getSkills(character);
    for (const type in skills) {
      const skill = skills[type];
      if (_.isDefined(skill.spCost)) {
        profession.trained[type] = true;
      }
    }

    character.setStat(STATS.PROFESSION_MASTERY, 1, profession.type);
    profession.trained["mastery"] = true;
    await profession.performMasteryActions(character);

    profession.spSpent = profession.maxSp;
  }
}

module.exports = DeveloperTrainCommand;