"use strict";

const Items = require('@app/content/items').Items;

const STATS = require('@constants').STATS;

class Equipment {
  constructor() {
    this._equipment = {};

    this._added   = [];
    this._removed = [];
  }

  /**
   * Load a character's equipment from DB into the character, trying cache first.
   *
   * @param {Character} character - The character to load the equipment for.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  static async load(character, connection) {
    const [rows, ] = await connection.query('SELECT * FROM equipment WHERE character_id = ?', [character.id]);

    let equipment = new Equipment();
    for (let row of rows) {
      equipment.add(row.type, row.category, row.id);
    }

    return equipment;
  }

  /**
   * Save this inventory to the DB.
   *
   * @param {string} character_id - The ID of the character to save the inventory of.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async save(character_id, connection) {
    let queries = [];
    let fields  = [];

    for (const entry of this._added) {
      queries.push("INSERT INTO equipment SET ?;");
      fields.push({
        character_id,
        type: entry.type,
        category: entry.category
      });
    }

    for (const entry of this._removed) {
      queries.push("DELETE FROM equipment WHERE character_id = ? AND type = ? AND category = ? LIMIT 1;");
      fields.push(character_id);
      fields.push(entry.type);
      fields.push(entry.category);
    }

    if (queries.length > 0 ) {
      await connection.query(queries.join(' '), fields);
    }
  }

  /**
   * Get the types of slots a character has.
   *
   * @return {array}
   */
  get slots() {
    return ['weapon', 'accessory', 'relic', 'armour'];
  }

  /**
   * Equip a piece of equipment that is already in a psare slot.
   *
   * @param {Character} character - The character equipping the new item.
   * @param {Item} newItem The new item being equipped.
   *
   * @return {array} The messages generated from equipping the item.
   */
  equip(character, newItem) {
    const oldItem = character[newItem.equipType];

    oldItem.unequipFrom(character);
    newItem.equipTo(character);

    character.equipment.add(oldItem.type, oldItem.equipType);
    character.equipment.remove(newItem.type, newItem.equipType);

    return [`You equip your ${newItem.getDisplayName(character)}, tucking your ${oldItem.getDisplayName(character)} away for later.`];
  }

  /**
   * Add a piece of equipment.
   *
   * @param {string} type - The type to add to the inventory.
   * @param {string} category - The category of the equipment.
   * @param {integer} dbId - The database ID of the equipment, if loading.
   */
  add(type, category, dbId = false) {
    let item = Items.new(type);

    if (dbId) {
      item.dbId = dbId;
    }
    else {
      this._added.push({ type, category });
    }

    if (_.isUndefined(this._equipment[category])) {
      this._equipment[category] = [];
    }

    this._equipment[category].push(item);
  }

  /**
   * Remove a piece of equipment.
   *
   * @param {string} type - The type of the item to add to the inventory.
   * @param {string} category - The category of the equipment.
   */
  remove(type, category) {
    for (const idx in this._equipment[category]) {
      if (this._equipment[category][idx].type === type) {
        this._equipment[category].splice(idx, 1);
      }
    }

    this._removed.push({ type, category });
  }

  /**
   * Check if you have a piece of equipment.
   *
   * @param {string} type - The type of the equipment to check.
   * @param {string} category - The category of the equipment to check.
   *
   * @return boolean
   */
  has(type, category) {
    for (const idx in this._equipment[category]) {
      if (this._equipment[category][idx].type === type) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check to see if a character has a free slot for a specific category.
   *
   * @param {string} category - The category to check.
   * @param {Character} character - The character to check for.
   *
   * @return {boolean}
   */
  hasFreeSlot(category, character) {
    return _.get(this._equipment, category, []).length + 1 < this.getMaxSlots(category, character);
  }

  /**
   * Get the max number of slots in a specific category for a character.
   *
   * @param {string} category - The category to check.
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getMaxSlots(category, character) {
    return 3 + character.getStat(STATS.EQUIPMENT_SLOT_INCREASES, category);
  }

  /**
   * Get a list of all items, or items in a category.
   *
   * @param {string} category - The category to get or false if all.
   *
   * @return {array}
   */
  list(category = false) {
    if (category) {
      return _.get(this._equipment, category, []);
    }

    let list = [];
    for (const slot of this.slots) {
      list = list.concat(this.list(slot));
    }

    return list;
  }

  /**
   * Get all the weapons this character has.
   *
   * @return {array}
   */
  get weapons() {
    return this._equipment['weapon'];
  }

  /**
   * Get all the relics this character has.
   *
   * @return {array}
   */
  get relics() {
    return this._equipment['relic'];
  }

  /**
   * Get all the armour this character has.
   *
   * @return {array}
   */
  get armour() {
    return this._equipment['armour'];
  }

  /**
   * Get all the accessories this character has.
   *
   * @return {array}
   */
  get accessories() {
    return this._equipment['accessory'];
  }
}

module.exports = Equipment;