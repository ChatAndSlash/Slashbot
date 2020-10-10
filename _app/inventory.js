"use strict";

const Items = require('@app/content/items').Items;

class Inventory {
  /**
   * Constructor.
   *
   * @param {integer} character_id - The ID of the character that owns this inventory.
   */
  constructor(character_id) {
    this.character_id = character_id;

    // Internal list of items the character has
    this._items = {};

    // Items that have changed during the current action, used to update the DB
    this._items_changed = new Set();
  }

  /**
   * Load a character's inventory from DB into the character.
   *
   * @param {Character} character - The character to load the inventory for.
   * @param {PromiseConnection} connection - The database connection to use.
   *
   * @return {Inventory}
   */
  static async load(character, connection) {
    const [rows, ] = await connection.query('SELECT * FROM items WHERE character_id = ?', [character.id]);

    let inventory = new Inventory(character.id);
    for (let row of rows) {
      inventory.add(row.type, row.quantity, row.id);
    }

    return inventory;
  }

  /**
   * Save this inventory to the DB.
   *
   * @param {string} character_id - The ID of the character to save the inventory of.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async save(character_id, connection) {
    const items = this.list();
    let queries = [];
    let fields  = [];

    for (const itemType of this.changed) {
      // Add new items
      if (items[itemType].dbId === null && items[itemType].quantity > 0) {
        queries.push('INSERT INTO items SET ?;');
        fields.push(items[itemType].getDbFields(character_id));

        // Update changed items
      }
      else {
        queries.push('UPDATE items SET ? WHERE id = ?;');
        fields.push(items[itemType].getDbFields(character_id));
        fields.push(items[itemType].dbId);
      }
    }

    if (queries.length > 0 ) {
      await connection.query(queries.join(' '), fields);
    }
  }

  /**
   * Get the changed items from this inventory.
   *
   * @return {Set}
   */
  get changed() {
    return this._items_changed;
  }

  /**
   * Add an item to your inventory.
   *
   * @param {string} type - The type of the item to add to the inventory.
   * @param {integer} quantity - The number to add.
   * @param {integer} dbId - The database ID of the item, if loading.
   *
   * @return {integer} The actual quantity added.
   */
  add(type, quantity = 1, dbId = false) {
    if ( ! (type in this._items)) {
      this._items[type]          = Items.new(type);
      this._items[type].quantity = 0;
    }

    let item = this._items[type];

    // Make sure not to add more than max quantity
    if (item.maxQuantity && item.quantity + parseInt(quantity) > item.maxQuantity) {
      quantity = item.maxQuantity - item.quantity;
    }

    item.quantity += parseInt(quantity);

    // If database ID is provided, we're loading from DB
    if (dbId) {
      item.dbId = dbId;
    }
    // If no database ID is provided, this is a changed item
    else {
      this._items_changed.add(type);
    }

    // Return the actual amount of items added
    return quantity;
  }

  /**
   * Remove an item from your inventory.
   *
   * @param {string} type - The type of the item to remove from the inventory.
   * @param {integer} quantity - The number to remove.
   *
   * @throws {Error}
   */
  remove(type, quantity = 1) {
    if (0 === quantity) {
      return;
    }

    if ( ! this.has(type, quantity)) {
      throw new Error(`Character #${this.character_id} does not have enough '${type}' to remove (requested ${quantity}).`);
    }

    this._items[type].quantity -= quantity;
    this._items_changed.add(type);
  }

  /**
   * Check if you have some items.
   *
   * @param {string} type - The type of the item to check.
   * @param {integer} quantity - The number to add.
   *
   * @return {boolean}
   */
  has(type, quantity = 1) {
    if (_.isUndefined(this._items[type])) {
      return false;
    }

    if (this._items[type].quantity < quantity) {
      return false;
    }

    return true;
  }

  /**
   * Returns the quantity of the specified item the character is carrying.
   *
   * @param {string} itemType - The type of item to get the quantity of.
   *
   * @return {integer}
   */
  quantity(itemType) {
    return _.isUndefined(this._items[itemType]) ? 0 :this._items[itemType].quantity;
  }

  /**
   * List all the items you have.
   *
   * @return {array}
   */
  list() {
    return this._items;
  }

  /**
   * List all the items you have by item class.
   *
   * @param {object} itemClass - The class of item to filter by.
   *
   * @return {array}
   */
  listByClass(itemClass) {
    let items = [];

    for (let key of Object.keys(this._items)) {
      if (this._items[key] instanceof itemClass && this._items[key].quantity > 0) {
        items.push(this._items[key]);
      }
    }

    return items;
  }
}

module.exports = Inventory;