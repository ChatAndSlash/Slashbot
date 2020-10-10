"use strict";

const { Actions, Options }  = require('slacksimple');
const { Encounters }        = require('@app/content/encounters');
const { WatermoonLocation } = require('@app/content/locations/watermoon');

const { PROFESSIONS, FLAGS } = require('@constants');

const ENCOUNTER_BARAD             = 'watermoon-gilded-barad';
const ACTION_ASK_GLADIATORS       = 'ask_gladiators';
const ACTION_ASK_AXES             = 'ask_axes';
const ACTION_ASK_AURETH           = 'ask_aureth';
const ACTION_ASK_WATERMOON        = 'ask_watermoon';
const ACTION_ASK_AURETH_FINAL     = 'ask_aureth_final';
const ACTION_ASK_ABOUT_LICH_QUEEN = 'ask_lich_queen';

/**
 * Coliseum.  Gladiator trainer & coliseum fights.
 */
class Coliseum extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-gilded-coliseum',
      displayName: __('Coliseum'),
      description: __("*Watermoon, Gilded District*\n\"Graaaaar!\" you hear from your side, as a burly man is thrown out a door and bounces to the floor in front of you.  He stands up, dusts himself off, and bows.\n\n\"A disagreement betwen gentlemen,\" he says.  \"Barad at your service.  Now what can I do for you?  Are you looking to join the Gladiator's Guild, or maybe pick up a choice axe or two?  Or perhaps I can entice to a fight or two in the Coliseum proper?\"  He indicates the door he was just ejected from.  \"Whole lot of fun times to be had in there, I tell you.\""),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-sterling_st',
      ],
      shopEquipment: {
        'weapons': {
          shopText: __('Buy Axes'),
          shopDescription: __("\n\n\"Axes, is it?, he asks, picking one up and tossing it from hand to hand effortlessly.  \"They're tricky to handle and on average don't do as much damage as you'd expect, *but!*  If you can manage to sink one into an unprepared enemy and score a critical hit, *blammo!*  They'll do *tons* of extra damage and really pay off.\"\n\nIn a flash, he hurls the axe he's holding at a training dummy and decapitates it.\n\n\"Ahahah, just like that!\""),
          equipment: [
            'equipment-weapons-axes-020_lumber_axe',
            'equipment-weapons-axes-023_cruel_handaxe',
            'equipment-weapons-axes-026_studded_hatchet',
            'equipment-weapons-axes-028_serrated_splitaxe',
            'equipment-weapons-axes-030_spiked_waraxe',
          ],
        },
      }
    });
  }

  /**
   * Executed when a character travels to this location.
   *
   * @param {Character} character - The character doing the travelling.
   *
   * @return {string}
   */
  async onTravelTo(character) {
    // Set Barad as current encounter to enable conversations with him
    character.encounter = Encounters.new(ENCOUNTER_BARAD);

    return super.onTravelTo(character);
  }

  /**
   * Get the equipment sold by this shop.
   *
   * @param {Character} character - The Character doing the buying.
   *
   * @return {object}
   */
  getShopEquipment(character) {
    let shopEquipment = _.cloneDeep(this._shopEquipment);

    // 1 or more dragons defeated
    if (character.location.getLivingDragons(character) <= 2) {
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-033_sharpened_cleaver');
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-036_heavy_hacker');
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-038_the_carver');
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-040_two_handed_battleaxe');
    }

    // 2  or more dragons defeated
    if (character.location.getLivingDragons(character) <= 1) {
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-043_angled_faceripper');
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-046_flanged_waraxe');
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-048_massive_chopper');
      shopEquipment.weapons.equipment.push('equipment-weapons-axes-050_blacksteel_battleaxe');
    }

    return shopEquipment;
  }

  /**
   * If you have no mining pick, only option is to start encounter that is intro to this area.
   *
   * @param {Character} character - The character to get action buttons for.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    actions = super.getActions(character, actions);
    actions.addButton(__("Trainer"), "train");

    actions.addButton(__("Rest"), "rest");

    // Build conversation choices
    let options = new Options;
    options.add(__("Gladiators"), { type: ENCOUNTER_BARAD, action: ACTION_ASK_GLADIATORS });
    options.add(__("Axes"), { type: ENCOUNTER_BARAD, action: ACTION_ASK_AXES });
    options.add(__("Aureth"), { type: ENCOUNTER_BARAD, action: ACTION_ASK_AURETH });
    options.add(__("Watermoon"), { type: ENCOUNTER_BARAD, action: ACTION_ASK_WATERMOON });

    if (character.hasFlag(FLAGS.DIED_TO_LICH_QUEEN)) {
      options.add("Lich Queen", { type: ENCOUNTER_BARAD, action: ACTION_ASK_ABOUT_LICH_QUEEN });
    }

    actions.addSelect(__("Ask Barad about..."), "encounter", options.getCollection());

    if (this.areAllDragonsDead(character) && ! this.hasLystone(character)) {
      actions.addButton(__("About Aureth..."), "encounter", { params: { action: ACTION_ASK_AURETH_FINAL } });
    }

    return actions;
  }

  /**
   * Get the professions that the character can change to at this location.
   *
   * @param {Character} character - The character looking to change professions.
   *
   * @return {array}
   */
  getAvailableProfessions(character) {
    return [
      PROFESSIONS.GLADIATOR,
    ].filter((value) => {
      return character.profession.type !== value;
    });
  }
}

module.exports = Coliseum;