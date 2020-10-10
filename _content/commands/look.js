"use strict";

const { Command }              = require('@app/content/commands');
const { Locations }            = require('@app/content/locations');
const { Actions, Attachments } = require('slacksimple');
const { Profession }          = require('@app/content/professions');

const {
  COLORS,
  CHARACTER_STATE,
  RECOVER_AP
} = require('@constants');

const BOOST_MAX_AP = 'max_ap';

/**
 * Get a description of the character's current situation.
 */
class LookCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;
    const info = this.info;
    let attachments = new Attachments();

    // If the current profession isn't loaded, load it and add any SP added to the unloaded one
    if ( ! character.profession.loaded) {
      const addedSp = character.profession.addedSp;
      character.profession = await Profession.loadSpecific(character, character.profession.type);
      character.profession.sp += addedSp;
    }

    if (character.state === CHARACTER_STATE.WOUNDED) {
      let actions = new Actions();
      actions.addButton(__("Pay %d AP", RECOVER_AP), 'recover', { params: { payWith: 'ap' } });
      actions.addButton(__("Pay %d gold", character.getRecoveryCost()), 'recover', { params: { payWith: 'gold' } });

      attachments.add({
        title: __("Do not despair.  This is just another learning experience.\n\nWhat price would you pay, my champion?"),
        actions
      });

      return character.slashbot.say('', character, { attachments });
    }

    // At 0 ap, sell that boost!
    if (character.ap === 0 && ! character.hasBoost(BOOST_MAX_AP) && character.state === CHARACTER_STATE.IDLE) {
      attachments.add({
        title: __("You've run out of Action Points, but it doesn't have to be that way.\nVisit your local Premium Item vendor and buy a Max AP Boost for 25 Dragon Scales to enjoy a 30-day boost to your maximum AP!"),
        color: COLORS.ZERO_AP,
      });
    }

    if (character.hasChestCurse()) {
      attachments.add(character.getChestCurseAttachment());
    }

    attachments.add({
      fields: character.getFields(),
      color: _.get(info, "color", COLORS.INFO),
    });

    let actions = character.getActions();

    if (actions.getCollection().length) {
      attachments.add({
        title: character.getLookTitle(),
        actions: actions,
        color: _.get(info, "color", COLORS.INFO),
      });

      while (actions.getCollection().length > 5) {
        actions.dropRow();
        attachments.add({
          title: " ",
          actions,
          color: _.get(info, "color", COLORS.INFO),
        });
      }
    }

    // If idle, can travel, add travel buttons
    if (CHARACTER_STATE.IDLE === character.state) {
      if (character.getConnectedLocations().length) {
        let actions = new Actions();
        for (const locationType of character.getConnectedLocations()) {
          const location = Locations.new(locationType);
          actions.addButton(location.getButtonText(character), "travel", { params: { to: location.type } });
        }

        attachments.add({
          title: __("Places to go:"),
          actions,
          color: _.get(info, "color", COLORS.INFO),
        });
      }
    }
    // If in combat, add skill buttons
    else if (CHARACTER_STATE.FIGHTING === character.state) {
      const actions = character.getSkillActions();
      if (actions.getCollection().length) {
        attachments.add({
          title: __("Skills:"),
          actions,
          color: _.get(info, "color", COLORS.INFO),
        });
      }
    }

    // If no message timestamp, say new entry
    if (_.isUndefined(info.message_ts)) {
      // Add preText, if any
      let description = _.isUndefined(info.preText)
        ? ''
        : info.preText + "\n";

      // Add message
      description += _.isUndefined(info.message)
        ? character.getLookDescription()
        : info.message;

      // Add any extra text
      description += _.isUndefined(info.extraText)
        ? ''
        : info.extraText;

      // Delaying this command, so an update can be displayed first?
      let messageDelay = _.get(info, 'delay', 0);

      character.slashbot.say(description, character, { attachments, messageDelay });

      // If timestamp exists, update previous message
    }
    else {
      let messageText = info.resetDescription
        ? character.getLookDescription()
        : this.message.text;

      character.slashbot.update(this.message, messageText, character, attachments);
    }
  }
}

module.exports = LookCommand;