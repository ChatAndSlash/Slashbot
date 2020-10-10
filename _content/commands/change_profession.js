"use strict";

const Command     = require('@app/content/commands').Command;
const Profession  = require('@app/content/professions').Profession;
const Professions = require('@app/content/professions').Professions;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const COLORS   = require('@constants').COLORS;
const IMG_ROOT = require('@constants').IMG_ROOT;
/**
 * Change to a new profession.
 */
class ChangeProfessionCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === 'list') {
      await this.showProfessions();
    }
    else if (this.info.action === 'view') {
      await this.viewProfession();
    }
    else if (this.info.action === 'change') {
      await this.changeTo();
    }
  }

  /**
   * Get the professions that the character can change to at this location.
   *
   * @return {array} The available professions.
   */
  _getAvailableProfessions() {
    return this.character.location.getAvailableProfessions(this.character);
  }

  /**
   * Show the professions that can be changed to.
   */
  async showProfessions() {
    const character = this.character;
    const location  = character.location;

    let description = location.getDescription(character) + __("\nYou can choose one of the following professions:");
    let actions = new Actions();

    const characterProfessions = await character.listProfessions();
    for (let professionType of this._getAvailableProfessions()) {

      const professionIdx = characterProfessions.findIndex((profession) => {
        return profession.type === professionType;
      });

      const profession = professionIdx >= 0
        ? characterProfessions[professionIdx]
        : Professions.new(professionType);

      const name = profession.getDisplayName(character);
      const professionDescription = profession.getDescription(character);
      const sp = profession.spSpent < profession.maxSp
        ? `_${profession.spSpent}/${profession.maxSp} SP_`
        : "_(Mastered)_";

      actions.addButton(profession.getDisplayName(character), "change_profession", { params: { action: "view", profession_type: profession.type } });
      description += `\n>- *${name} ${sp}:* ${professionDescription}`;
    }

    actions.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      description,
      attachments: Attachments.one({
        title: __('What profession are you interested in?'),
        actions,
        color: COLORS.INFO,
      })
    });
  }

  /**
   * View detailed information about a profession before switching to it.
   */
  async viewProfession() {
    let character = this.character;

    // Load profession from DB
    const profession = await Profession.loadSpecific(character, this.info.profession_type);

    let actions = new Actions();

    const style = profession.hasMetRequirements(character) ? 'default' : 'danger';
    actions.addButton(__("Change (%s)", profession.getCostTextShort(character)), "change_profession", { params: { action: "change", profession_type: profession.type }, style });

    actions.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      description: profession.getDetails(character),
      attachments: Attachments.one({
        title: __("Do you want to learn how to be a %s?", profession.getDisplayName(character)),
        text: profession.getCostText(),
        thumb_url: IMG_ROOT + profession.image,
        actions,
        color: COLORS.INFO,
      })
    });
  }

  /**
   * Change to a new profession.
   */
  async changeTo() {
    let character = this.character;
    let title = '';

    // Load profession from DB
    const profession = await Profession.loadSpecific(character, this.info.profession_type);

    if ( ! profession.hasMetRequirements(character)) {
      title = profession.getRequirementError(character);
    }
    // Otherwise, switch profession
    else {
      const cost = profession.getCost(character);
      character.gold -= cost;

      character.profession = profession;

      character.track('Change Profession');

      title = __("You spend %d gold and, after some time training, change professions to %s.", cost, profession.getDisplayName(character));

      if (character.supportProfession === profession.type) {
        title += __("\n\nYour Support Skill has been cleared, as you already have access to it in this profession.");
        character.supportProfession = '';
      }
    }

    await this.updateLast({
      attachments: Attachments.one({
        title
      }),
      doLook: true
    });
  }
}

module.exports = ChangeProfessionCommand;