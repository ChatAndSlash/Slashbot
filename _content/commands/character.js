"use strict";

const Command     = require('@app/content/commands').Command;
const Fields      = require('slacksimple').Fields;
const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;
const Profession  = require('@app/content/professions').Profession;
const Spells      = require('@app/content/spells').Spells;
const Text        = require('@util/text');

const { COLORS, STATS, REPUTATION_LEVELS } = require('@constants');

const ACTION_CHARACTER = 'character';
const ACTION_BOOSTS = 'boosts';
const ACTION_INVENTORY = 'inventory';
const ACTION_PROFESSIONS = 'professions';
const ACTION_SKILLS = 'skills';
const ACTION_SPELLS = 'spells';
const ACTION_REPUTATION = 'reputation';

/**
 * Display character information.
 */
class CharacterCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const character = this.character;

    if (_.isUndefined(this.info.action)) {
      await this.showCharacter(character);
    }
    else if (ACTION_CHARACTER === this.info.action) {
      await this.showCharacter(character, true);
    }
    else if (ACTION_BOOSTS === this.info.action) {
      await this.showBoosts(character);
    }
    else if (ACTION_INVENTORY === this.info.action) {
      await this.showInventory(character);
    }
    else if (ACTION_PROFESSIONS === this.info.action) {
      await this.showProfessions(character);
    }
    else if (ACTION_SKILLS === this.info.action) {
      await this.showSkills(character);
    }
    else if (ACTION_SPELLS === this.info.action) {
      await this.showSpells(character);
    }
    else if (ACTION_REPUTATION === this.info.action) {
      await this.showReputation(character);
    }
    else {
      throw new Error(`Invalid action '${this.info.action}'.`);
    }
  }

  /**
   * Add choices for learning more about a character.
   *
   * @param {Character} character - The Character to get more choices for.
   * @param {Attachments} attachments - The attachments to add options to.
   * @param {string} current - The currently-displayed action (no need to display this).
   *
   * @return {Attachments}
   */
  addChoices(character, attachments, current) {
    let options = new Options();

    if (ACTION_CHARACTER !== current) {
      options.add("Character Stats", { action: ACTION_CHARACTER });
    }

    if (ACTION_BOOSTS !== current) {
      options.add("Boosts", { action: ACTION_BOOSTS });
    }

    if (ACTION_INVENTORY !== current) {
      options.add("Inventory", { action: ACTION_INVENTORY });
    }

    if (ACTION_REPUTATION !== current) {
      options.add("Reputation", { action: ACTION_REPUTATION });
    }

    if (ACTION_PROFESSIONS !== current) {
      options.add("Professions", { action: ACTION_PROFESSIONS });
    }

    if (ACTION_SKILLS !== current) {
      options.add("Skills", { action: ACTION_SKILLS });
    }

    if (ACTION_SPELLS !== current && character.level >= 3) {
      options.add("Spells", { action: ACTION_SPELLS });
    }

    attachments.addSelect("More Information", ACTION_CHARACTER, options.getCollection());
    attachments.addButton("Okay", "look");

    return attachments;
  }

  /**
   * Display character stats.
   *
   * @param {Character} character - The character to display stats for.
   * @param {boolean} update - If we should update the last message.  Otherwise, say() it.
   */
  async showCharacter(character, update = false) {
    let fields = new Fields();
    fields.add("Level", character.level, true);
    fields.add("Profession", `${character.profession.getDisplayName(character)} (${character.profession.spSpent} SP Spent)`, true);
    fields.add("Weapon Damage", `${character.minDamage}-${character.maxDamage}`, true);
    fields.add("Spell Power", character.spellPower, true);
    fields.add("Force", character.force, true);
    fields.add("Technique", character.technique, true);
    fields.add("Offence", character.getOffence(), true);
    fields.add("Defence", character.defence, true);
    fields.add("Crit Chance", character.crit, true);
    fields.add("Dodge Chance", character.dodge, true);

    let attachments = Attachments.one({
      color: COLORS.INFO,
      fields,
    });
    attachments = this.addChoices(character, attachments, ACTION_CHARACTER);

    character.slashbot.say("Your stats:", character, { attachments });
  }

  /**
   * Display character boosts.
   *
   * @param {Character} character - The character to display boosts for.
   */
  async showBoosts(character) {
    let description = character.boosts.length > 0
      ? "You have the following boosts active:\n"
      : "You have no boosts active.";

    for (const boost of character.boosts) {
      description += `>- ${boost.getDescription(character)}\n`;
    }

    let attachments = Attachments.one({ title: " ", color: COLORS.INFO });
    attachments = this.addChoices(character, attachments, ACTION_SKILLS);

    await this.updateLast({
      description,
      attachments
    });
  }

  /**
   * Show the items in the inventory of the character.
   *
   * @param {Character} character - The character to show inventory items for.
   */
  async showInventory(character) {
    let fields = new Fields();
    for (const slot of character.equipment.slots) {
      let text = `- ${character[slot].getDisplayName(character)} (equipped)`;

      const items = character.equipment.list(slot);
      for (const item of items) {
        text += `\n- ${item.getDisplayName(character)}`;
      }

      const name = this.getSlotDescription(slot, items.length + 1, character.equipment.getMaxSlots(slot, character));
      fields.add(name, text, true);
    }

    fields.add("Pet", character.pet.getDisplayName(character), true);

    let inventory = [];

    const items = character.inventory.list();
    for (const key in items) {
      if (items[key].quantity > 0) {
        inventory.push(`${items[key].quantity}x ${items[key].getDisplayName(character)}`);
      }
    }

    if (inventory.length === 0) {
      inventory.push("You don't have any items yet.");
    }

    const description = `*Your inventory:*\n${inventory.join(', ')}`;

    let attachments = Attachments.one({ fields, color: COLORS.INFO });
    attachments = this.addChoices(character, attachments, ACTION_INVENTORY);

    await this.updateLast({ description, attachments });
  }

  /**
   * Get the description for a slot field.
   *
   * @param {string} slot - The slot to get the description for.
   * @param {integer} amount - The amount of items in that slot.
   * @param {integer} max - The maximum number of items in that slot.
   *
   * @return {string}
   */
  getSlotDescription(slot, amount, max) {
    switch (slot) {
      case "weapon": return `Weapons: ${amount}/${max}`;
      case "relic": return `Relic: ${amount}/${max}`;
      case "armour": return `Armour: ${amount}/${max}`;
      case "accessory": return `Accessories: ${amount}/${max}`;
    }
  }

  /**
   * Show the professions the character has trained.
   *
   * @param {Character} character - The character to show inventory items for.
   */
  async showProfessions(character) {
    let description = "You have training in the following professions:\n";
    for (const profession of await Profession.list(character)) {
      description += `>- *${profession.getDisplayName(character)}${this.getMasteryText(character, profession)}:* ${profession.spSpent} SP Spent, ${profession.sp} SP Available\n`;
    }

    let attachments = Attachments.one({ title: " ", color: COLORS.INFO });
    attachments = this.addChoices(character, attachments, ACTION_PROFESSIONS);

    await this.updateLast({
      description,
      attachments
    });
  }

  /**
   * Get the mastery informational text to append to profession description.
   *
   * @param {Character} character - The character to check for.
   * @param {Profession} profession - The profession to check.
   *
   * @return {string}
   */
  getMasteryText(character, profession) {
    const masteryLevel = profession.getMasteryLevel(character);

    if (0 === masteryLevel) {
      return "";
    }
    else if (1 === masteryLevel) {
      return " (Mastered)";
    }

    return ` (Mastered +${masteryLevel - 1})`;
  }

  /**
   * Show the skills this character has trained.
   *
   * @param {Character} character - The character to show inventory items for.
   */
  async showSkills(character) {
    const trained = character.profession.trained;
    const skills  = character.profession.getSkills(character);

    let description = "Your profession lets you train the following skills:\n";

    for (const type of Object.keys(skills)) {
      const skill = skills[type];
      const trainedText = trained[type] ? "_(Trained)_ " : "";
      description += `>- *${skill.name}*: ${trainedText}${skill.description}\n`;
    }

    let attachments = Attachments.one({ title: " ", color: COLORS.INFO });
    attachments = this.addChoices(character, attachments, ACTION_SKILLS);

    await this.updateLast({
      description,
      attachments
    });
  }

  /**
   * Show the spells this character knows.
   *
   * @param {Character} character - The character to show inventory items for.
   */
  async showSpells(character) {
    let description = "You have learned the following spells:";

    for (let spellType of character.knownSpells) {
      const spell = Spells.new(spellType);
      const mpCost = `${spell.getMpCost(character)} MP`;
      const staminaCost = spell.staminaCost > 0 ? `, ${spell.staminaCost} Stamina` : '';
      description += `\n>- *${spell.getDisplayName(character)} (${mpCost}${staminaCost}):* ${spell.getDescription(character)}`;

      if (spell.properties.length) {
        let properties = spell.properties.map((property) => Text.getPropertyName(property, character));
        description += ` _(${properties.join(", ")})_`;
      }
    }

    if (character.knownSpells.length === 0) {
      description += "\n>- None";
    }

    let attachments = Attachments.one({ title: " ", color: COLORS.INFO });
    attachments = this.addChoices(character, attachments, ACTION_SPELLS);

    await this.updateLast({
      description,
      attachments
    });
  }

  /**
   * Display character reputation.
   *
   * @param {Character} character - The character to display reputation for.
   */
  async showReputation(character) {
    let description;

    if (character.hasStat(STATS.REPUTATION_GAINED, { subType: STATS.WATERMOON_REPUTATION })) {
      description = "You have the following reputation:\n";

      const watermoonReputation = character.getStat(STATS.REPUTATION_GAINED, STATS.WATERMOON_REPUTATION);
      let watermoonReputationLevel = "Unknown";
      if (watermoonReputation >= REPUTATION_LEVELS.ESTEEMED) {
        watermoonReputationLevel = "Esteemed";
      }
      else if (watermoonReputation >= REPUTATION_LEVELS.RESPECTED) {
        watermoonReputationLevel = "Respected";
      }
      else if (watermoonReputation >= REPUTATION_LEVELS.APPRECIATED) {
        watermoonReputationLevel = "Appreciated";
      }
      else if (watermoonReputation >= REPUTATION_LEVELS.KNOWN) {
        watermoonReputationLevel = "Known";
      }

      description += `> :speaking_head_in_silhouette: ${watermoonReputation} Watermoon Reuptation (Level: ${watermoonReputationLevel})`;
    }
    else {
      description = "You have amassed no significant reputation.";
    }

    let attachments = Attachments.one({ title: " ", color: COLORS.INFO });
    attachments = this.addChoices(character, attachments, ACTION_SKILLS);

    await this.updateLast({
      description,
      attachments
    });
  }
}

//       character.increaseStat(STATS.REPUTATION_GAINED, amount, STATS.WATERMOON_REPUTATION);


module.exports = CharacterCommand;