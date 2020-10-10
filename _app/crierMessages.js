"use strict";

/**
 * The town crier messages.
 */
class CrierMessages {
  /**
   * Load towne crier messages from DB.
   *
   * @param {Connection} connection - The DB connection to use.
   *
   * @return {array}
   */
  static async load(connection) {
    const [rows, ] = await connection.query('SELECT cm.message AS text, c.display_name AS name FROM crier_messages cm INNER JOIN characters c ON cm.character_id = c.id ORDER BY cm.created_at DESC LIMIT 5;');

    return rows;
  }

  /**
   * Add a new crier message.
   *
   * @param {string} message - The message to add.
   * @param {Character} character - The character adding the message.
   *
   */
  static async add(message, character) {
    await character.connection.query('INSERT INTO crier_messages SET ?', {
      character_id: character.id,
      message,
    });
  }
}

module.exports = CrierMessages;