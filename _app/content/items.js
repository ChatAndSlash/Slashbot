"use strict";

let collection = {};
let names      = {};
let types      = new Map();

const Files   = require('@util/files');
const Content = require('@app/content')(collection, names, types);
const Fields  = require('slacksimple').Fields;

/**
 * Base item class.
 */
class Item {
  constructor(info) {
    this.dbId = null;

    this.equipType = false;

    this.type         = _.get(info, 'type', '');
    this._displayName = _.get(info, 'displayName', '');
    this._buttonText  = _.get(info, 'buttonText', this._displayName);
    this.aliases      = _.get(info, 'aliases', []);
    this._description = _.get(info, 'description', '');
    this.quantity     = _.get(info, 'quantity', 1);
    this.maxQuantity  = _.get(info, 'maxQuantity', false);
    this.gold         = _.get(info, 'gold', 0);
    this.shouldBold   = _.get(info, 'shouldBold', false);
  }

  /**
   * Gets all the names this item can go by, including aliases.
   *
   * @return {array} The list of names.
   */
  get allNames() {
    return this.aliases.concat(this._displayName);
  }

  /**
   * Get the display name of this item.
   *
   * @param {Character} character - The character examining this item.
   *
   * @return {string}
   */
  getDisplayName(character) {
    return this._displayName;
  }

  /**
   * Get the description of this item.
   *
   * @param {Character} character - The character getting the description of this item
   *
   * @return {string}
   */
  getDescription(character) {
    return this._description;
  }

  /**
   * Gets the text to display on the button for this item.
   *
   * @param {Character} character - The character examining this item.
   *
   * @return {string}
   */
  getButtonText(character) {
    return this._buttonText;
  }

  /**
   * Get the cost to purchase this item.
   *
   * @param {Character} character - The character looking to buy this item.
   *
   * @return {integer}
   */
  getCost(character) {
    const costMultiplier = this.equipType
      ? character.location.equipCostMultiplier
      : character.location.itemCostMultiplier;

    return Math.ceil(this.gold * costMultiplier);
  }

  /**
   * Get the description of the cost to purchase this item.
   *
   * @param {Character} character - The character looking to buy this item.
   *
   * @return {string}
   */
  getCostDescription(character) {
    return `${this.getCost(character)}g`;
  }

  /**
   * Get the sell price for this item.
   *
   * @param {Character} character - The character getting the sell price.
   *
   * @return {integer}
   */
  getSellPrice(character) {
    return Math.floor(this.gold / 10);
  }

  /**
   * Get the description of the sell price for this item.
   *
   * @param {Character} character - The character getting the sell price.
   *
   * @return {string}
   */
  getSellPriceDescription(character) {
    return `${this.getSellPrice(character)}g`;
  }

  /**
   * If the provided character can afford this item.
   *
   * @param {Character} character - The character looking to buy the item.
   * @param {integer} quantity - The quantity of this item to purchase.
   *
   * @return {boolean}
   */
  canBePurchasedBy(character, quantity = 1) {
    if (this.maxQuantity && character.inventory.quantity(this.type) + quantity > this.maxQuantity) {
      return false;
    }

    return character.gold >= (this.getCost(character) * quantity);
  }

  /**
   * Gets the warning to display when attempting to purchase an item you cannot afford.
   *
   * @param {Character} character - The character doing the purchasing.
   * @param {integer} quantity - The quantity of the item attempted to purchase.
   * @param {string} displayName - The name of the item being purchased.
   */
  getCannotPurchaseError(character, quantity, displayName) {
    if (this.maxQuantity && character.inventory.quantity(this.type) + quantity > this.maxQuantity) {
      return `:warning: You cannot have more than ${this.maxQuantity}x ${this.getDisplayName(character)}.`;
    }

    return `:warning: You cannot afford ${quantity}x ${displayName}.`;
  }

  /**
   * Subtract the cost of this item from the provided character.
   *
   * @param {Character} character - The character buying the item.
   * @param {integer} quantity - The quantity of this item to purchase.
   */
  subtractCostFrom(character, quantity = 1) {
    if ( ! this.canBePurchasedBy(character)) {
      throw new Error(`Character cannot afford ${this.type}.`);
    }

    character.gold -= (this.getCost(character) * quantity);
  }

  /**
   * Identify if selling this item will exceed the character's max allowable gold.
   *
   * @param {Character} character - The character selling this item.
   * @param {integer} quantity - The quantity of this item to sell.
   *
   * @return {boolean}
   */
  willExceedMaxGold(character, quantity = 1) {
    return character.gold + (this.getSellPrice(character) * quantity) > character.getMaxGold();
  }

  /**
   * Identify if selling this item will put the player over 90% of the character's max
   * allowable gold.
   *
   * @param {Character} character - The character selling this item.
   * @param {integer} quantity - The quantity of this item to sell.
   *
   * @return {boolean}
   */
  willApproachMaxGold(character, quantity = 1) {
    return character.gold + (this.getSellPrice(character) * quantity) > character.getMaxGold() * 0.9;
  }

  /**
   * Add the sell price of this item to the provided character.
   *
   * @param {Character} character - The character selling this item.
   * @param {integer} quantity - The quantity of this item to sell.
   */
  addSellPriceTo(character, quantity = 1) {
    character.gold += (this.getSellPrice(character) * quantity);
  }

  /**
   * Do any actions required on buying this item.
   *
   * @param {Character} character - The character buying this item.
   * @param {integer} quantity - The quantity of items being bought.
   */
  doBuyActions(character, quantity) { }

  /**
   * Get the fields to display when this item is examined.
   *
   * @param {Character} character - The character examining this item.
   *
   * @return {array}
   */
  getExamineFields(character) {
    let fields = new Fields();

    fields.add("You own", this.quantity, true);

    return fields;
  }

  /**
   * Gets the DB fields required to save this item.
   *
   * @param {string} character_id - The ID of the character that owns this item.
   *
   * @return {object}
   */
  getDbFields(character_id) {
    return {
      character_id: character_id,
      type: this.type,
      quantity: this.quantity,
    };
  }

  /**
   * Get a description of how this item will change the provided character's stats.
   *
   * @param {Character} character - The character to evaluate against.
   *
   * @return {string}
   */
  getShopDescription(character) { }
}

/**
 * Utility class for searching and creating new item objects.
 */
class Items extends Content {}

module.exports = {
  Item,
  Items
};

/**
 * @type array The collection of items.
 */
Files.loadContent(`${CONTENT_FILES_PATH}/items/`, `${CONTENT_FILES_PATH}/items/`, collection);

/**
 * @type object The names of the items, for quick reference.
 */
Files.getNames(collection, names);

/**
 * @type objec The types of the items, keyed by name, for quick reference.
 */
Files.getTypes(collection, types);
