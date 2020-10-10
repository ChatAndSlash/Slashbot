"use strict";

/**
 * The pets this character owns.
 */
class PetsOwned {
  constructor(info) {
    this.character_id = _.get(info, 'character_id');
    this.owned = [];
  }

  /**
   * Load a character's available pets from DB into the character, trying cache first.
   *
   * @param {Character} character - The character to load the available pets for.
   *
   * @return {array}
   */
  static async load(character) {
    const [rows, ] = await character.connection.query('SELECT * FROM pets WHERE character_id = ?', [character.id]);

    let petsOwned = new PetsOwned({ character_id: character.id });
    for (let row of rows) {
      petsOwned.owned.push({
        id: row.id,
        type: row.type
      });
    }

    return petsOwned;
  }

  /**
   * Save owned pets to the DB.
   *
   * @param {Character} character - The character to save the available pets for.
   */
  async save(character) {
    let queries = [];
    let fields  = [];

    // Only need to save new pets, since you can't sell a pet (you monster!)
    for (let pet of this.owned) {
      if ( ! pet.id) {
        queries.push('INSERT INTO pets (character_id, type) VALUES (?,?);');
        fields.push(character.id);
        fields.push(pet.type);
      }
    }

    if (queries.length > 0 ) {
      await character.connection.query(queries.join(' '), fields);
    }
  }
}

module.exports = PetsOwned;