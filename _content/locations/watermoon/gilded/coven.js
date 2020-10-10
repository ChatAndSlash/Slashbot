"use strict";

const { Actions, Options }  = require('slacksimple');
const { Encounters }        = require('@app/content/encounters');
const { WatermoonLocation } = require('@app/content/locations/watermoon');
const { getBuyUrl }         = require('@util/text');

const { PROFESSIONS, FLAGS } = require('@constants');

const ENCOUNTER_BELTARA           = 'watermoon-gilded-beltara';
const ACTION_ASK_BATTLE_WITCHES   = 'ask_battle_witches';
const ACTION_ASK_GUNS             = 'ask_guns';
const ACTION_ASK_AURETH           = 'ask_aureth';
const ACTION_ASK_WATERMOON        = 'ask_watermoon';
const ACTION_ASK_AURETH_FINAL     = 'ask_aureth_final';
const ACTION_ASK_ABOUT_LICH_QUEEN = 'ask_lich_queen';

/**
 * Coven.  Battle Witch trainer.
 */
class Coven extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-gilded-coven',
      displayName: __('Coven'),
      description: __("*Watermoon, Gilded District*\nBeltara, the coven leader approaches you.\n\n\"I see you're not here for the usual poultices, salves, and useless love potions, are you?  If you're looking to join our proud coven of Battle Witches, we'll be more than happy to train you.  New apprentices are always welcome.\""),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-back_alley',
      ],
      shopEquipment: {
        'weapons': {
          shopText: __('Buy Guns'),
          shopDescription: __("\n\nShe catches you eyeing the guns hung along the wall.\"Ah, maybe you're interested in a dwarven-forged pistol?  They don't work quite like any other weapon you've used so far, so be sure you keep an eye on your ammo.  You don't want to need to reload at an inopportune moment!\""),
          equipment: [
            'equipment-weapons-guns-020_training_pistol',
            'equipment-weapons-guns-023_s22',
            'equipment-weapons-guns-026_p25',
            'equipment-weapons-guns-028_s26',
            'equipment-weapons-guns-030_p28',
          ],
        },
        'relics': {
          shopText: __('Buy Relics'),
          shopDescription: __("\n\nWe have a broad stock of relics here.  All you could ever want for casting our most powerful spells.\""),
          equipment: [
            'equipment-relics-021_bone_ritual_knife',
            'equipment-relics-024_rosewood_ritual_knife',
            'equipment-relics-026_jade_ritual_knife',
            'equipment-relics-028_obsidian_ritual_knife',
          ],
        },
      },
      shopSpells: {
        'simple': {
          shopText: __('Learn Spells'),
          items: [
            'enrage',
            'windwall',
            'hoarfrost_spike',
          ]
        },
        'premium': {
          shopText: __('Learn Premium Spells'),
          style: 'primary',
          items: [
            'teleport',
          ]
        }
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
    // Set Beltara as current encounter to enable conversations with her
    character.encounter = Encounters.new(ENCOUNTER_BELTARA);

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
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-033_s32');
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-036_r28');
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-038_s34');
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-040_r29');

      shopEquipment.relics.equipment.push('equipment-relics-031_brass_chalice');
      shopEquipment.relics.equipment.push('equipment-relics-034_cunife_chalice');
      shopEquipment.relics.equipment.push('equipment-relics-036_silver_chalice');
      shopEquipment.relics.equipment.push('equipment-relics-038_rose_gold_chalice');
    }

    // 2  or more dragons defeated
    if (character.location.getLivingDragons(character) <= 1) {
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-043_s40');
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-046_p36');
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-048_r31');
      shopEquipment.weapons.equipment.push('equipment-weapons-guns-050_r36');

      shopEquipment.relics.equipment.push('equipment-relics-041_maple_staff');
      shopEquipment.relics.equipment.push('equipment-relics-044_mahogany_staff');
      shopEquipment.relics.equipment.push('equipment-relics-046_snakewood_staff');
      shopEquipment.relics.equipment.push('equipment-relics-048_blackwood_staff');
    }

    return shopEquipment;
  }

  /**
   * Get all the spells this location sells.
   *
   * @param {Character} character - The character at this location.
   *
   * @return {object}
   */
  getShopSpells(character) {
    let shopSpells = _.cloneDeep(this._shopSpells);

    // 1 or more dragons defeated
    if (character.location.getLivingDragons(character) <= 2) {
      shopSpells.simple.items.push('flame_jet');
      shopSpells.simple.items.push('heal');
    }

    // 2  or more dragons defeated
    if (character.location.getLivingDragons(character) <= 1) {
      shopSpells.simple.items.push('lightning_strike');
    }

    return shopSpells;
  }

  /**
   * Get the actions for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting actions.
   *
   * @return {array}
   */
  getActions(character) {
    let actions = new Actions();

    actions = super.getActions(character, actions);

    actions.addButton(__("Trainer"), "train");

    // Build conversation choices
    let options = new Options;
    options.add(__("Battle Witches"), { type: ENCOUNTER_BELTARA, action: ACTION_ASK_BATTLE_WITCHES });
    options.add(__("Guns"), { type: ENCOUNTER_BELTARA, action: ACTION_ASK_GUNS });
    options.add(__("Aureth"), { type: ENCOUNTER_BELTARA, action: ACTION_ASK_AURETH });
    options.add(__("Watermoon"), { type: ENCOUNTER_BELTARA, action: ACTION_ASK_WATERMOON });

    if (character.hasFlag(FLAGS.DIED_TO_LICH_QUEEN)) {
      options.add("Lich Queen", { type: ENCOUNTER_BELTARA, action: ACTION_ASK_ABOUT_LICH_QUEEN });
    }

    actions.addSelect(__("Ask Beltara about..."), "encounter", options.getCollection());

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
      PROFESSIONS.BATTLE_WITCH,
    ].filter((value) => {
      return character.profession.type !== value;
    });
  }

  /**
   * Get any extra description for the shop type the user is looking at.
   *
   * @param {Character} character - The character doing the shopping.
   * @param {string} shopType - The type of shop the character is shopping at.
   *
   * @return {string}
   */
  getShopDescription(character, shopType) {
    let description = '';

    if ('premium' === shopType) {
      description = __("\n\n*Beltara smiles when she sees you looking at the gilded Premium Spell case.*  \"If you're looking to _really_ expand your magical repetoire, consider a Premium Spell!  Not necessarily _more powerful_ than other spells, but they'll definitely increase your capabilities.  You'll need some Dragon Scales, though, which you can get here:\"\n\n") + getBuyUrl(character);
    }

    return description + super.getShopDescription(character, shopType);
  }
}

module.exports = Coven;