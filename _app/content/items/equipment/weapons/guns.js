"use strict";

const { sprintf } = require("sprintf-js");
const Weapon = require("@app/content/items/equipment/weapons");

const { FLAGS, PROPERTIES, PROFESSIONS } = require('@constants');

/**
 * Gun weapon class.
 */
class GunWeapon extends Weapon {
  /**
   * Constructor.
   *
   * @param {object} info - The initialization information.
   */
  constructor(info) {
    super(info);

    this.properties.push(PROPERTIES.RANGED_ATTACK);
  }

  /**
   * Get the maximum amount of ammo this weapon has.
   *
   * @param {Character} character - The character getting max ammo.
   *
   * @return {integer}
   */
  getMaxAmmo(character) {
    let maxAmmo = this.maxAmmo;

    // Master Battle Witches have more max ammo
    if (character.hasMasteredProfession(PROFESSIONS.BATTLE_WITCH)) {
      const Professions = require('@app/content/professions').Professions;
      const battleWitchProfession = Professions.new(PROFESSIONS.BATTLE_WITCH);
      maxAmmo = Math.ceil(this.maxAmmo * battleWitchProfession.getMasteryBonus(character));
    }

    // Add any ammo provided by accessories
    maxAmmo += character.accessory.maxAmmo;

    return maxAmmo;
  }

  /**
   * Get extra field information to add to character field in combat.
   *
   * @param {Character} character - The character in combat.
   * @param {array} extra - The extra field info.
   *
   * @return
   */
  addCombatExtraFieldInfo(character, extra) {
    extra.push(`Ammo: ${this.getAmmo(character)}/${this.getMaxAmmo(character)}`);

    return extra;
  }

  /**
   * Unequip this item from the specified character.
   *
   * @param {Character} character - The character to unequip the item from.
   */
  unequipFrom(character) {
    super.unequipFrom(character);
    character.clearFlag(FLAGS.AMMO_COUNT);
  }

  /**
   * Equip this item to the specified character.
   *
   * @param {Character} character - The character to equip the item to.
   */
  equipTo(character) {
    super.equipTo(character);
    character.setFlag(FLAGS.AMMO_COUNT, this.getMaxAmmo(character));
  }

  /**
   * Get the amount of ammo currently in the gun for this character.
   *
   * @param {Character} character - The character to check ammo for.
   *
   * @return {integer}
   */
  getAmmo(character) {
    return character.getFlag(FLAGS.AMMO_COUNT);
  }

  /**
   * Consume some ammunition.
   *
   * @param {Character} character - The character consuming ammo.
   * @param {integer} amount - The amount to consume.
   */
  consumeAmmo(character, amount = 1) {
    const ammo = this.getAmmo(character);
    character.setFlag(FLAGS.AMMO_COUNT, ammo - amount);
  }

  /**
   * If this weapon needs to be reloaded.
   *
   * @param {Character} character - The character in combat.
   *
   * @return {boolean}
   */
  needsReloading(character) {
    return this.getAmmo(character) === 0;
  }

  /**
   * Reload your gun, and return the message for it.
   *
   * @param {Character} character - The character reloading.
   *
   * @return {array}
   */
  doReload(character, reloadText = "You carefully reload your %s.") {
    character.setFlag(FLAGS.AMMO_COUNT, this.getMaxAmmo(character));

    return [sprintf(reloadText, this.getDisplayName(character))];
  }

  /**
   * Get the number of attacks this weapon does for a combat round.
   * Can't fire more shots than ammo you have.
   *
   * @param {Character} character - The attacking character.
   * @param {integer} forceAttacks - Force this many attacks.  Useful for limiting to 1.
   *
   * @return {integer}
   */
  getAttacks(character, forceAttacks) {
    if (forceAttacks) {
      return forceAttacks;
    }

    return Math.min(super.getAttacks(character), this.getAmmo(character));
  }

  /**
   * Perform any post-fight actions that always happen.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(character, messages) {
    character.setFlag(FLAGS.AMMO_COUNT, this.getMaxAmmo(character));

    return super.doFightEnd(character, messages);
  }
}

module.exports = GunWeapon;