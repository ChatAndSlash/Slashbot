"use strict";

const Weapon = require("@app/content/items/equipment/weapons");

const { PROPERTIES } = require('@constants');

const AXE_CRIT_DAMAGE_BONUS = 1.5;

/**
 * Axe weapon class.
 *
 * 5% bonus crit chance, and 50% crit damage.
 */
class AxeWeapon extends Weapon {
  /**
   * Constructor.
   *
   * @param {object} info - The initialization information.
   */
  constructor(info) {
    super(info);

    this.properties.push(PROPERTIES.BONUS_CRIT_DAMAGE);
  }

  /**
   * After an attack has been performed, allow the attacker to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Character} character - The character doing the attacking.
   * @param {Combatant} defender - The defending combatant.
   *
   * @return {object} The modified attackInfo.
   */
  doAttackerPostAttackProcessing(attackInfo, character, defender) {
    if (attackInfo.didCrit) {
      attackInfo.damage = Math.ceil(attackInfo.damage * AXE_CRIT_DAMAGE_BONUS);
    }

    return attackInfo;
  }

  /**
   * Get the average damage of this weapon.
   *
   * @return integer
   */
  getAverageDamage() {
    const avgAttacks = (this.minAttacks + this.maxAttacks) / 2;
    const avgDmg = (this.minDamage + this.maxDamage) / 2 * avgAttacks;
    const critDmg = this.crit / 100 * avgDmg * 2;

    return avgDmg + critDmg;
  }
}

module.exports = AxeWeapon;