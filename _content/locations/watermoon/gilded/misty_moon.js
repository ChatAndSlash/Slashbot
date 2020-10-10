"use strict";

const { Actions, Options }  = require('slacksimple');
const { Encounters }        = require('@app/content/encounters');
const { WatermoonLocation } = require('@app/content/locations/watermoon');

const { PROFESSIONS, FLAGS } = require('@constants');

const ENCOUNTER_NICHOLAS          = 'watermoon-gilded-nicholas';
const ACTION_ASK_MIST_DANCERS     = 'ask_mist_dancers';
const ACTION_ASK_HIDDEN_DAGGERS   = 'ask_hidden_daggers';
const ACTION_ASK_AURETH           = 'ask_aureth';
const ACTION_ASK_WATERMOON        = 'ask_watermoon';
const ACTION_ASK_AURETH_FINAL     = 'ask_aureth_final';
const ACTION_ASK_ABOUT_LICH_QUEEN = 'ask_lich_queen';

/**
 * Misty Moon.  Mist Dancer trainer.
 */
class MistyMoon extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-gilded-misty_moon',
      displayName: __('Misty Moon'),
      description: __("*Watermoon, Gilded District*\nA tall, thin man walks languorously up to you and tosses his long, silver hair as he inspects you.\n\n\"Yes, I think you'll do.  I'm Nicholas, and I run this place.  You, though, you'd make a wonderful Dancer, I can tell.  So long as you can learn how to use a Hidden Dagger with some skill.  You'll find that stealth and defence are the best offence!\""),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-back_alley',
      ],
      shopEquipment: {
        'weapons': {
          shopText: __('Buy Hidden Daggers'),
          shopDescription: __("\n\n\"These are quite special.\"  He picks up a pair of daggers, and in a flash, makes them disappear.\n\n\"If your enemy cannot see where the attack is coming from...\" he says as he steps towards you, re-appearing his daggers seemingly out of nowhere.  \"Well, it becomes very easy to sneak in an attack that causes immense amounts of pain!\""),
          equipment: [
            'equipment-weapons-hidden_daggers-020_carving_knives',
            'equipment-weapons-hidden_daggers-023_springloaded_stilettos',
            'equipment-weapons-hidden_daggers-026_crossdraw_dirk',
            'equipment-weapons-hidden_daggers-028_slender_slicer',
            'equipment-weapons-hidden_daggers-030_blacksteel_beltknife'
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
  onTravelTo(character) {
    // Set Nicholas as current encounter to enable conversations with him
    character.encounter = Encounters.new(ENCOUNTER_NICHOLAS);

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
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-033_leaf_dagger');
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-036_belt_bowie');
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-038_canteen_cutter');
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-040_loosesleeve_carver');
    }

    // 2  or more dragons defeated
    if (character.location.getLivingDragons(character) <= 1) {
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-043_pocket_penknife');
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-046_elbow_dagger');
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-048_flexible_edge');
      shopEquipment.weapons.equipment.push('equipment-weapons-hidden_daggers-050_invisible_blades');
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

    // Build conversation choices
    let options = new Options;
    options.add(__("Mist Dancers"), { type: ENCOUNTER_NICHOLAS, action: ACTION_ASK_MIST_DANCERS });
    options.add(__("Hidden Daggers"), { type: ENCOUNTER_NICHOLAS, action: ACTION_ASK_HIDDEN_DAGGERS });
    options.add(__("Aureth"), { type: ENCOUNTER_NICHOLAS, action: ACTION_ASK_AURETH });
    options.add(__("Watermoon"), { type: ENCOUNTER_NICHOLAS, action: ACTION_ASK_WATERMOON });

    if (character.hasFlag(FLAGS.DIED_TO_LICH_QUEEN)) {
      options.add("Lich Queen", { type: ENCOUNTER_NICHOLAS, action: ACTION_ASK_ABOUT_LICH_QUEEN });
    }

    actions.addSelect(__("Ask Nicholas about..."), "encounter", options.getCollection());

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
      PROFESSIONS.MIST_DANCER,
    ].filter((value) => {
      return character.profession.type !== value;
    });
  }
}

module.exports = MistyMoon;