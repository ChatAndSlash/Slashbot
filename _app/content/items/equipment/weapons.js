"use strict";

const Equipment = require("@app/content/items/equipment").Equipment;
const Random    = require("@util/random");

const PROPERTIES  = require("@constants").PROPERTIES;

/**
 * Base weapon class.
 */
class Weapon extends Equipment {
  constructor(info) {
    super(info);

    this.equipType = 'weapon';

    this.minDamage    = _.get(info, 'minDamage', 0);
    this.maxDamage    = _.get(info, 'maxDamage', 0);
    this.minAttacks   = _.get(info, 'minAttacks', 1);
    this.maxAttacks   = _.get(info, 'maxAttacks', 1);
    this.maxAmmo      = _.get(info, 'maxAmmo', 0);
    this.crit         = _.get(info, 'crit', 0);
    this.properties   = _.get(info, 'properties', [PROPERTIES.IS_ATTACK]);
  }

  /**
   * Perform a defend action.
   *
   * @param {Character} character - The character defending.
   *
   * @return {array} The messages generated.
   */
  doDefend(character) {
    return [];
  }

  /**
   * Get the maximum amount of ammo this weapon has.
   *
   * @param {Character} character - The character getting max ammo.
   *
   * @return {integer}
   */
  getMaxAmmo(character) {
    return this.maxAmmo;
  }

  /**
   * Unequip this item from the specified character.
   *
   * @param {Character} character - The character to unequip the item from.
   */
  unequipFrom(character) {
    character._crit -= this.crit;

    character.weapon = null;
  }

  /**
   * Equip this item to the specified character.
   *
   * @param {Character} character - The character to equip the item to.
   */
  equipTo(character) {
    character._crit += this.crit;

    character.weapon = this;
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return {string}
   */
  getShopDescription(character) {
    const oldWeapon = character.weapon;

    if (oldWeapon.type === this.type) {
      return "--Equipped--";
    }

    const diff = Math.floor(this.getAverageDamage() - oldWeapon.getAverageDamage());
    const sign = diff >= 0 ? '+' : '';

    const attacks = (this.minAttacks > 1 || this.maxAttacks > 1)
      ? `, ${this.minAttacks}-${this.maxAttacks} Attacks`
      : "";

    const ammo = this.getMaxAmmo(character) > 0
      ? `, ${this.getMaxAmmo(character)} Ammo`
      : "";

    return `${this.minDamage}-${this.maxDamage} Damage${attacks}${ammo} (${sign}${diff})`;
  }

  /**
   * Get the average damage of this weapon.
   *
   * @return integer
   */
  getAverageDamage() {
    const avgAttacks = (this.minAttacks + this.maxAttacks) / 2;
    const avgDmg = (this.minDamage + this.maxDamage) / 2 * avgAttacks;
    const critDmg = this.crit / 100 * avgDmg;

    return avgDmg + critDmg;
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
    return extra;
  }

  /**
   * After an attack has been performed, allow the attacker to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Character} character - The character doing the attacking.
   * @param {Combatant} defender -The defending combatant.
   *
   * @return object
   */
  doAttackerPostAttackProcessing(attackInfo, character, defender) {
    return attackInfo;
  }

  /**
   * Get the number of attacks this weapon does for a combat round.
   *
   * @param {Character} character - The attacking character.
   * @param {integer} forceAttacks - Force this many attacks.  Useful for limiting to 1.
   *
   * @return integer
   */
  getAttacks(character, forceAttacks) {
    if (forceAttacks) {
      return forceAttacks;
    }

    return Random.between(character.weapon.minAttacks, character.weapon.maxAttacks);
  }

  /**
   * Perform wrap-up tasks that have to happen before stats, etc are affected.
   *
   * @param {Character} character - The character involved in the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightWrapUp(character, messages) {
    return messages;
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
    return messages;
  }

  /**
   * Get the amount of ammo currently in the gun for this character.
   *
   * @param {Character} character - The character to check ammo for.
   *
   * @return {integer}
   */
  getAmmo(character) {
    return false;
  }

  /**
   * Consume some ammunition.
   *
   * @param {Character} character - The character consuming ammo.
   * @param {integer} amount - The amount to consume.
   */
  consumeAmmo(character, amount) { }

  /**
   * If this weapon needs to be reloaded.
   *
   * @param {Character} character - The character in combat.
   *
   * @return {boolean}
   */
  needsReloading(character) {
    return false;
  }
}

module.exports = Weapon;