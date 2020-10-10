"use strict";

const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;

/**
 * Haberdashery.  Accessories
 */
class Haberdashery extends WatermoonLocation {
  constructor() {
    super({
      type: 'watermoon-gilded-haberdashery',
      displayName: __('Haberdashery'),
      description: __("*Watermoon, Gilded District*\n"),
      image: 'locations/city.png',
      connectedLocations: [
        'watermoon-gilded-auric_ave',
      ],
      shopEquipment: {
        'accessories': {
          shopText: __('Buy Accessories'),
          equipment: [
            'equipment-accessories-watermoon-020_inlaid_copper_bangle',
            'equipment-accessories-watermoon-020_gold_moonstone_earring',
            'equipment-accessories-watermoon-023_magic_bullet',
            'equipment-accessories-watermoon-026_redweave_silk_belt',
            'equipment-accessories-watermoon-030_delicate_silver_wristlet',
            'equipment-accessories-watermoon-030_whitegold_diamond_earring',
          ],
        },
        'quickArmour': {
          shopText: __('Buy Quick Armour'),
          equipment: [
            'equipment-armour-quick-022_padded_leather',
            'equipment-armour-quick-025_studded_leather',
            'equipment-armour-quick-027_hardened_leather',
            'equipment-armour-quick-029_sturdy_leather'
          ],
        },
        'heavyArmour': {
          shopText: __('Buy Heavy Armour'),
          equipment: [
            'equipment-armour-heavy-022_dented_plate',
            'equipment-armour-heavy-025_beaten_plate',
            'equipment-armour-heavy-027_waxed_plate',
            'equipment-armour-heavy-029_shined_plate',
          ],
        },
        'arcaneArmour': {
          shopText: __('Buy Arcane Armour'),
          equipment: [
            'equipment-armour-arcane-022_apprentices_robe',
            'equipment-armour-arcane-025_embroidered_robe',
            'equipment-armour-arcane-027_reinforced_robe',
            'equipment-armour-arcane-029_runed_robe'
          ],
        },
      },
    });
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
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-032_rogue_leather');
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-035_rascal_leather');
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-037_scoundrel_leather');
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-039_rapscallion_leather');

      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-032_ancient_plate');
      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-035_restored_plate');
      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-037_reinforced_plate');
      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-039_fortified_plate');

      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-032_vermillion_robe');
      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-035_gamboge_robe');
      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-037_sarcoline_robe');
      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-039_incarnadine_robe');

      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-033_amethyst_heart_amulet');
      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-036_emeraline_silk_belt');
      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-040_powerful_gold_armband');
      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-040_crystal_inset_ruby_earring');
    }

    // 2  or more dragons defeated
    if (character.location.getLivingDragons(character) <= 1) {
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-042_snake_leather');
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-045_alligator_leather');
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-047_bear_leather');
      shopEquipment.quickArmour.equipment.push('equipment-armour-quick-049_drake_leather');

      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-042_glamoured_plate');
      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-045_enchanted_plate');
      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-047_sorcerous_plate');
      shopEquipment.heavyArmour.equipment.push('equipment-armour-heavy-049_runic_plate');

      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-042_dapper_war_robe');
      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-045_empowered_war_robe');
      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-047_exarch_war_robe');
      shopEquipment.arcaneArmour.equipment.push('equipment-armour-arcane-049_master_war_robe');

      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-043_personal_shielding_belt');
      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-046_skysilk_belt');
      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-050_masterful_platinum_armlet');
      shopEquipment.accessories.equipment.push('equipment-accessories-watermoon-050_managem_earring');
    }

    return shopEquipment;
  }
}

module.exports = Haberdashery;