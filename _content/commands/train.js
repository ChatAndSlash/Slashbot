"use strict";

const Actions     = require('slacksimple').Actions;
const Command     = require('@app/content/commands').Command;
const Attachments = require('slacksimple').Attachments;
const Text        = require('@util/text');

const COLORS    = require('@constants').COLORS;
const STATS     = require('@constants').STATS;
const STD_DELAY = require('@constants').STD_DELAY;

const ACTION_TRAIN   = 'train';
const ACTION_SUPPORT = 'support';
const ACTION_STAT    = 'stat';
const ACTION_SKILL   = 'skill';
const ACTION_MASTERY = 'mastery';
const ACTION_IMPROVE = 'improve';

/**
 * Train new skills and stats for a profession.
 */
class TrainCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === ACTION_STAT) {
      await this.trainStat();
    }
    else if (this.info.action === ACTION_SKILL) {
      await this.trainSkill();
    }
    else if (this.info.action === ACTION_MASTERY) {
      await this.trainMastery();
    }
    else if (this.info.action === ACTION_IMPROVE) {
      await this.improveMastery();
    }
    else if (this.info.action === ACTION_SUPPORT) {
      if (_.isDefined(this.info.profession)) {
        await this.changeSupport();
      }
      else {
        await this.showSupport();
      }
    }
    else if (this.info.action === ACTION_TRAIN) {
      if (this.character.profession.spSpent < this.character.profession.maxSp) {
        await this.showAvailable();
      }
      else {
        await this.showImprove();
      }
    }
    else {
      await this.showActions();
    }
  }

  /**
   * Show the actions available at this trainer.
   */
  async showActions() {
    const character = this.character;
    let attachments = new Attachments().add({
      title: __("What can I do for you?"),
      fields: character.getFields(),
      color: COLORS.INFO
    });

    if (character.location.getAvailableProfessions(character).length) {
      attachments.addButton(__("Change Profession"), "change_profession", { params: { action: "list" } });
    }

    attachments.addButton(__("Train"), "train", { params: { action: ACTION_TRAIN } });
    attachments.addButton(__("Support Skill"), "train", { params: { action: ACTION_SUPPORT } });
    attachments.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      attachments
    });
  }

  /**
   * Show the available stats, skills, and special things that can be trained.
   *
   * @param {string} mode - The mode to communicate with the player - update or say.
   * @param {integer} messageDelay - The amount to delay showing available trainables.
   */
  async showAvailable({ mode = 'update', messageDelay = 0 } = {}) {
    const character    = this.character;
    const profession   = character.profession;
    let description    = character.location.getDescription(character) + __('\nYou can train in the following:');
    let attachments    = new Attachments();
    let statButtons    = new Actions();
    let skillButtons   = new Actions();
    let specialButtons = new Actions();

    // Loop through stats, build buttons
    const stats = profession.getStats();
    for (const type in stats) {
      const stat  = stats[type];
      const level = _.get(profession.trained, type, 0);

      if (level < stat.costs.length) {
        const increaseText = "+" + Text.getLongAttributeName(type, stat.increase);
        const costText = stat.costs[level] + " SP";
        const levelText = __("Level %d/%d", level, stat.costs.length);
        const style = profession.canTrainStat(type) ? 'default' : 'danger';

        description += `\n>- *${increaseText}:* _[${costText}]_ ${levelText}`;
        statButtons.addButton(increaseText, "train", { params: { action: ACTION_STAT, type: type }, style });
      }
    }

    if (statButtons.length) {
      attachments.add({ title: __("Statistics:"), actions: statButtons, color: COLORS.INFO });
    }

    // Loop through skills, build buttons
    const skills = profession.getSkills(character, false);
    for (const type in skills) {
      const skill = skills[type];
      if (_.isDefined(skill.spCost)) {
        if (_.isUndefined(profession.trained[type])) {
          const name = skill.name;
          const skillDescription = skill.description;
          const cost = `${skill.spCost} SP`;
          const req = __("%d required", skill.reqSp);
          const style = profession.canTrainSkill(character, type) ? 'default' : 'danger';

          description += `\n>- *${name}:* _[${cost}, ${req}]_ ${skillDescription}`;

          if (skill.properties.length) {
            let properties = skill.properties.map((property) => Text.getPropertyName(property, character));
            description += __(" _(%s)_", properties.join(", "));
          }

          skillButtons.addButton(name, "train", { params: { action: ACTION_SKILL, type }, style });
        }
      }
    }

    if (skillButtons.length) {
      attachments.add({ title: __("Skills:"), actions: skillButtons, color: COLORS.INFO });
    }

    // Add mastery buttons
    if (_.isUndefined(profession.trained.mastery)) {
      const style = profession.canTrainMastery() ? 'default' : 'danger';

      description += __(
        "\n>- *Mastery:* _[%d SP, %d required]_ %s",
        profession.spMastery,
        profession.reqSpMastery,
        profession.masteryDescription
      );
      specialButtons.addButton(__("Mastery"), "train", { params: { action: ACTION_MASTERY }, style });
    }

    specialButtons.addButton(__("Done!"), "look", { params: { resetDescription: "true" }, style: 'primary' });
    attachments.add({ title: "Special:", actions: specialButtons, color: COLORS.INFO });

    description += __("\nYou have *%d* SP available and have spent *%d* SP in this profession.", profession.sp, profession.spSpent);

    if ("update" === mode) {
      await this.updateLast({
        description,
        attachments
      });
    }
    else {
      character.slashbot.say(description, character, { attachments, messageDelay });
    }
  }

  /**
   * Get the cost to improve this profession.
   *
   * @param {Character} character - The character improving their profession.
   *
   * @return {integer}
   */
  getImproveCost(character) {
    const current = character.profession.getMasteryLevel(character);
    return character.profession.maxSp * current;
  }

  /**
   * Offer to improve the character's Mastery.
   */
  async showImprove() {
    const character  = this.character;
    const profession = character.profession;

    const description = character.location.getDescription(character)
      + __('\n\n*You can improve your Mastery still further:* ')
      + character.profession.getMasteryImprovementDescription(character);

    let attachments = new Attachments().add({
      title: __('Do you wish to improve your Mastery for a cost of %d SP?', this.getImproveCost(character)),
      fields: character.getFields(),
      color: COLORS.INFO
    });

    const style = profession.sp >= this.getImproveCost(character) ? 'default' : 'danger';

    attachments.addButton(__("Yes"), "train", { params: { action: ACTION_IMPROVE }, style });
    attachments.addButton(__("No"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      description,
      attachments
    });
  }

  /**
   * Get the "safe" type for this stat to increase.  i.e. if it's a stat with a getter, return
   * the _stat name.
   *
   * @param {string} stat - The stat to get the safe type for.
   *
   * @return {string}
   */
  getSafeType(stat) {
    return ['force', 'technique', 'defence', 'spellPower', 'dodge', 'maxHp'].includes(stat)
      ? `_${stat}`
      : stat;
  }

  /**
   * Train a stat in a profession.
   */
  async trainStat() {
    const character  = this.character;
    const profession = character.profession;
    const type       = this.info.type;
    const safeType   = this.getSafeType(type);
    const stat       = profession.getStats()[type];

    let title = '';

    if (profession.canTrainStat(type)) {
      const oldLevel = _.get(profession.trained, type, 0);
      profession.trained[type] = oldLevel + 1;

      character[safeType] += stat.increase;

      const cost = stat.costs[oldLevel];
      profession.sp      -= cost;
      profession.spSpent += cost;

      title = __(":muscle: You spend %d SP and increase %s by %d!", cost, Text.getLongAttributeName(type), stat.increase);

      character.track('Train Stat', {
        stat: type,
        level: oldLevel + 1
      });
    }
    else {
      title = profession.getTrainStatError(character, type);
    }

    await this.updateLast({ attachments: Attachments.one({ title }) });
    await this.showAvailable({ mode: 'say', messageDelay: STD_DELAY });
  }

  /**
   * Train a skill in a profession.
   */
  async trainSkill() {
    const character  = this.character;
    const profession = character.profession;
    const skill      = profession.getSkills(character)[this.info.type];

    let title = '';

    if (profession.canTrainSkill(character, this.info.type)) {
      profession.trained[this.info.type] = true;

      profession.sp      -= skill.spCost;
      profession.spSpent += skill.spCost;

      title = __(":mortar_board: You spend %d SP and learn the %s skill!", skill.spCost, skill.name);

      character.track('Train Skill', { skill_type: skill.type });
    }
    else {
      title = profession.getTrainSkillError(character, this.info.type);
    }

    await this.updateLast({ attachments: Attachments.one({ title }) });
    await this.showAvailable({ mode: 'say', messageDelay: STD_DELAY });
  }

  /**
   * Train a character's mastery.
   */
  async trainMastery() {
    const character  = this.character;
    const profession = character.profession;

    let title = '';

    if (profession.canTrainMastery()) {
      profession.trained.mastery = true;
      character.setStat(STATS.PROFESSION_MASTERY, 1, character.profession.type);
      const rewardText = await profession.performMasteryActions(character);

      profession.sp      -= profession.spMastery;
      profession.spSpent += profession.spMastery;

      title = __(":dark_sunglasses: You have mastered the %s profession!  %s", profession.getDisplayName(character), profession.masteryDescription)
            + rewardText;

      character.track('Train Mastery');
    }
    else {
      title = profession.getTrainMasteryError(character);
    }

    await this.updateLast({ attachments: Attachments.one({ title }), doLook: true });
  }

  /**
   * Improve a character's mastery.
   */
  async improveMastery() {
    const character  = this.character;
    const profession = character.profession;

    let title = '';

    if (profession.sp >= this.getImproveCost(character)) {
      // Has to happen BEFORE incrementing mastery level so correct improvement is applied
      const rewardText = await profession.performImproveMasteryActions(character);

      profession.sp      -= this.getImproveCost(character);
      profession.spSpent += this.getImproveCost(character);

      // Has to happen AFTER subtracting improve cost or you subtract too much SP
      character.increaseStat(STATS.PROFESSION_MASTERY, 1, character.profession.type);

      title = __(":dark_sunglasses: You have improved your mastery of the %s profession!", profession.getDisplayName(character))
            + rewardText;

      character.track('Improve Mastery');
    }
    else {
      title = __("You don't have enough SP to improve your mastery.");
    }

    await this.updateLast({ attachments: Attachments.one({ title }), doLook: true });
  }

  /**
   * Show the list of support skills this character has access to.
   */
  async showSupport() {
    const character = this.character;

    const skills = character.profession.getSupportSkills(character);
    if (_.isEmpty(skills)) {
      return await this.updateLast({ attachments: Attachments.one({ title: __(":warning: You don't know any Support Skills.  Master a profession first!") }), doLook: true });
    }

    let description = character.location.getDescription(character) + __('\nYou have unlocked the following Support Skills:');
    let attachments = new Attachments().add({
      title: __("Which Support Skill do you want active?"),
      fields: character.getFields(),
      color: COLORS.INFO
    });

    for (const professionType in skills) {
      const currentText = character.supportProfession === professionType ? __("_(current)_ ") : "";
      const professionText = character.profession.type === professionType ? __("_(your profession)_ ") : "";
      const style = (currentText + professionText).length ? "danger" : "default";
      description += __("\n>- *%s*: %s%s%s", skills[professionType].name, currentText, professionText, skills[professionType].description);
      attachments.addButton(skills[professionType].name, "train", { params: { action: ACTION_SUPPORT, profession: professionType }, style });
    }

    attachments.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({ description, attachments });
  }

  /**
   * Change the support skill this character is using.
   */
  async changeSupport() {
    const character = this.character;
    let title = '';
    let color = '';

    if (this.info.profession === character.supportProfession) {
      title = __(":warning: You already have that Support Skill selected.");
      color = COLORS.WARNING;
    }
    else if (this.info.profession === character.profession.type) {
      title = __(":warning: You can't choose your current profession's Support Skill.");
      color = COLORS.WARNING;
    }
    else {
      character.supportProfession = this.info.profession;
      const skill = character.profession.getSupportSkills(character)[this.info.profession];
      title = __(":white_check_mark: You changed your Support Skill to %s.", skill.name);
      color = COLORS.GOOD;
    }

    await this.updateLast({ attachments: Attachments.one({ title, color }), doLook: true });
  }
}

module.exports = TrainCommand;