"use strict";

const mix       = require('mixwith').mix;
const Spell     = require('@app/content/spells').Spell;
const ScaleCost = require('@mixins/item/scale_cost').ScaleCost;

const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;

const SPELL_SCHOOLS = require('@constants').SPELL_SCHOOLS;
const COLORS        = require('@constants').COLORS;

class TeleportSpell extends mix(Spell).with(ScaleCost(25)) {
  constructor() {
    super({
      type: 'teleport',
      displayName: __('Teleport'),
      mpCost: 50,
      description: __("Instantly transport yourself to a major town center, avoiding any travel cost."),
      school: SPELL_SCHOOLS.DIVINITY,
      redisplaySpellMenu: false,
    });
  }

  /**
   * Display a list of locations to teleport to.
   *
   * @param {Character} character - The character casting the spell.
   */
  castIdle(character) {
    const teleportText = character.location.getDescription(character)
      + character.location.getTeleportWarning(character);

    let attachments = new Attachments().add({
      title: __("Where do you want to teleport to?"),
      fields: character.getFields(),
      color: COLORS.INFO
    });
    attachments.addSelect(__("Locations"), "teleport", this.getTeleportOptions(character).getCollection());
    attachments.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    character.slashbot.say(teleportText, character, { attachments });

    return "";
  }

  /**
   * Get the locations a character can teleport to.
   *
   * @param {Character} character - The character looking to teleport.
   *
   * @return {Options}
   */
  getTeleportOptions(character) {
    let options = new Options();

    // Can always teleport to Tyrose
    options.add(__("City of Tyrose, Town Center"), { action: "teleport", location: "tyrose" });

    if (character.hasKilledGreenDragon()) {
      options.add(__("Scatterslide Mines, Campfire"), { action: "teleport", location: "scatterslide-campfire" });
    }

    if (character.hasKilledBrownDragon()) {
      options.add(__("Watermoon, Exchange"), { action: "teleport", location: "watermoon-gilded-exchange" });
    }

    return options;
  }
}

module.exports = TeleportSpell;