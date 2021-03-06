"use strict";

const Consumable = require('@app/content/items/consumable').Consumable;

const PROFESSIONS = require('@constants').PROFESSIONS;

const ELIXIR_RESTORE_MP = require('@constants').ELIXIR_RESTORE_MP;

class ElixirConsumable extends Consumable {
  constructor() {
    super({
      type: 'consumables-elixir',
      displayName: __('Elixir'),
      gold: 10,
    });
  }

  /**
   * If this consumable item can actually be used right now.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  canBeUsed(character) {
    return character.mp < character.maxMp;
  }

  /**
   * Consume the elixir, restore MP.
   *
   * @param {Character} character - The character to restore MP for.
   *
   * @return {string} The message generated by consuming this item.
   */
  consume(character) {
    super.consume(character);

    const oldMp = character.mp;
    character.mp += this.getRestoreMp(character);
    const difference = character.mp - oldMp;

    return [__(':yum: You slug back an elixir and restore *%d* MP.', difference)];
  }

  /**
   * Get the cost to purchase this item.
   *
   * @param {Character} character - The character looking to buy this item.
   *
   * @return {integer}
   */
  getCost(character) {
    return Math.ceil(super.getCost(character) * this.getEffectMultiplier(character));
  }

  /**
   * Get the description for this item.
   *
   * @param {Character} character - The character examining this item.
   *
   * @return {string}
   */
  getDescription(character) {
    return __(
      "A flask full of bubbling blue liquid that will restore %d MP when you've exhausted your arcane energies.",
      this.getRestoreMp(character)
    );
  }

  /**
   * Get the amount of MP restored by an elixir for this character.
   *
   * @param {Character} character - The character restoring MP.
   *
   * @return {integer}
   */
  getRestoreMp(character) {
    return Math.ceil(ELIXIR_RESTORE_MP * this.getEffectMultiplier(character));
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return {string}
   */
  getShopDescription(character) {
    return __('Recover +%d MP.', this.getRestoreMp(character));
  }

  /**
   * Certain achievements boost consumable effects.
   *
   * @param {Character} character - The character to check.
   *
   * @return {number}
   */
  getEffectMultiplier(character) {
    let multiplier = 1;

    if (character.hasMasteredProfession(PROFESSIONS.NOVICE)) {
      const Professions = require('@app/content/professions').Professions;
      const noviceProfession = Professions.new(PROFESSIONS.NOVICE);
      multiplier += noviceProfession.getMasteryBonus(character);
    }

    return multiplier;
  }
}

module.exports = ElixirConsumable;