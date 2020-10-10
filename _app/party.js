const { getWeighted } = require('@util/random');
const { doAttack } = require('@app/combat');
const { keys, difference } = require('lodash');

// The max and min number of levels that govern attack chance.
const DIFF_MAX = 10;
const DIFF_MIN = 5;

// The chances to help on an attack
const ATTACK_CHANCE_MIN = 1;
const ATTACK_CHANCE_MED = 3;
const ATTACK_CHANCE_MAX = 5;

const STAT_CHESTS_OPENED = 'chests_opened';
const STAT_PROFESSIONS_MASTERED = 'professions_mastered';
const STAT_FIGHTS_WON = 'fights_won';

/**
 * Base party.
 */
class Party {
  constructor(info) {
    this.id       = info.id;
    this.name     = info.name;
    this.leader   = info.leader;
    this.members  = info.members;
    this.modified = false;
  }

  /**
   * Generator yielding all party members as Characters.
   *
   * @param {Character} character - The currently-active character.
   *
   * @yields {Character}
   */
  * allMembers() {
    for (let memberId in this.members) {
      yield this.members[memberId];
    }
  }

  /**
   * Generator yielding all party members that aren't the current character.
   *
   * @param {Character} character - The currently-active character.
   *
   * @yields {Character}
   */
  * otherMembers(character) {
    for (let member of this.allMembers()) {
      if (member.id !== character.id) {
        yield member;
      }
    }
  }

  /**
   * Generator yielding all active party members that aren't the current character.
   *
   * @param {Character} character - The currently-active character.
   *
   * @yields {Character}
   */
  * otherActiveMembers(character) {
    for (let member of this.otherMembers(character)) {
      if (member.isActive()) {
        yield member;
      }
    }
  }

  /**
   * Identify if the provided character is the leader of this party.
   *
   * @param {Character} character - The character to check.
   *
   * @return {Boolean}
   */
  isLeader(character) {
    return character.id === this.leader.id;
  }

  /**
   * Load the leader of a party.
   *
   * @param {integer} partyId - The ID of the party to load the leader for.
   * @param {Character} character - The character loading the leader.
   * @param {PromiseConnection} connection - The database connection to use.
   *
   * @return {Character}
   */
  static async getLeader(partyId, character, connection) {
    const [rows, ] = await connection.query('SELECT leader_id FROM parties WHERE id = ?', [partyId]);

    if (rows.length === 0) {
      throw new Error(`No party with ID ${partyId} found.`);
    }

    const Character = require('@app/character').Character;
    let leader = new Character();
    leader.loadParty = false;
    return leader.load(
      { id: rows[0].leader_id },
      character.slashbot,
      character.queueSuffix,
      { connection },
    );
  }

  /**
   * Load a party from DB, based on a character that is a member of that party.
   *
   * @param {Character} character - The character to load the party for.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  static async load(character, connection) {
    const Character = require('@app/character').Character;

    // Get all rows for party members in this character's party
    const [memberRows, ] = await connection.query('SELECT a.* FROM party_members a, party_members b WHERE a.party_id = b.party_id AND b.character_id = ?', [character.id]);

    if (memberRows.length === 0) {
      return false;
    }

    const [partyRows, ] = await connection.query('SELECT * from parties WHERE id = ?', [memberRows[0].party_id]);

    let members = {};
    let leader;

    for (let memberRow of memberRows) {
      // Build character for party member row
      let member = new Character();
      member.loadParty = false;
      await member.load(
        { id: memberRow.character_id },
        character.slashbot,
        character.queueSuffix,
        { connection },
      );
      member.enemy = character.enemy;
      members[member.id] = member;

      // If this is the leader, save for party
      if (partyRows[0].leader_id === memberRow.character_id) {
        leader = member;
      }
    }

    let party = new Party({
      id: partyRows[0].id,
      name: partyRows[0].name,
      leader,
      members,
    });

    return party;
  }

  /**
   * Get the fields to save the the database.
   *
   * @return {object}
   */
  getDbFields() {
    return {
      name: this.name,
    };
  }

  /**
   * Save the current party.
   *
   * For now, just saving party members - other attributes are changed at other times directly.
   *
   * @param {Connection} connection - The connection to use to save.
   */
  async save(connection) {
    if (this.modified) {
      const [rows, ] = await connection.query('SELECT character_id FROM party_members WHERE party_id = ?', [this.id]);
      const dbMemberIds = rows.map(row => row.character_id);
      const localMemberIds = keys(this.members).map(id => parseInt(id, 10));

      const toAdd = difference(localMemberIds, dbMemberIds);
      const toRemove = difference(dbMemberIds, localMemberIds);

      for (let characterId of toAdd) {
        await connection.query(`INSERT INTO party_members (party_id, character_id) VALUES (?, ?)`, [this.id, characterId]);
      }

      for (let characterId of toRemove) {
        await connection.query(`DELETE FROM party_members WHERE party_id = ? AND character_id = ?`, [this.id, characterId]);
      }

      await connection.query('UPDATE parties SET ? WHERE id = ?', [
        this.getDbFields(),
        this.id
      ]);
    }
  }

  /**
   * Perform actions that happen when fights are successful.
   *
   * @param {Character} character - The character involved in the combat.
   * @param {array} messages - An array of messages to display.
   *
   * @return {array} The modified array of messages to display.
   */
  doFightSuccess(character, messages) {
    this.incrementStat(character.connection, STAT_FIGHTS_WON);

    return messages;
  }

  /**
   * Increment party stats by a set amount.
   *
   * @param {Connection} connection - The DB connection to use.
   * @param {string} stat - The stat to set.
   * @param {integer} amount - The amount to increment by.
   */
  async incrementStat(connection, stat, amount = 1) {
    await connection.query(`UPDATE parties SET stats = JSON_SET(stats, '$.${stat}', IFNULL(JSON_EXTRACT(stats , '$.${stat}'), 0) + ${amount}) WHERE id = ?;`, this.id);
  }

  /**
   * Party members have a chance of attacking.
   *
   * @param {Character} character - The character doing the attacking.
   *
   * @return {array} Messages generated.
   */
  doPartyAction(character) {
    let messages = [];

    const helpMember = this.getHelpMember(character);
    if (helpMember) {
      messages = messages.concat(doAttack(
        this.members[helpMember],
        {
          message: `:handshake: ${this.members[helpMember].getTrueName()} attacks, dealing %s damage to %s.%s`,
          dodgeMessage: `:dash: ${this.members[helpMember].getTrueName()} attacks %s, but they dodge the attack!`,
          missMessage: `:dash: ${this.members[helpMember].getTrueName()} attacks %s, but misses!`,
        },
      ));
    }
    else {
      messages.push("Your party mills around, waiting for an opportunity to attack.");
    }

    return messages;
  }

  /**
   * Get the party member that is helping you, if any.
   *
   * @param {Character} character - The character doing the attacking.
   *
   * @return {string|false} - The ID of the helping member or false, if none.
   */
  getHelpMember(character) {
    let chances = [];
    let nothingWeight = 100;

    for (let member of this.otherActiveMembers(character)) {
      const weight = this.getHelpChanceMember(character.level, member.level);
      chances.push({ weight, value: member.id });
      nothingWeight -= weight;
    }
    chances.push({ weight: nothingWeight, value: false });

    return getWeighted(chances);
  }

  /**
   * Get the chance a party member will help a character.
   *
   * @param {integer} characterLevel - The level of the attacking character.
   * @param {integer} memberLevel - The level of the party member.
   *
   * @return {integer}
   */
  getHelpChanceMember(characterLevel, memberLevel) {
    const diff = Math.abs(characterLevel - memberLevel);
    return diff > DIFF_MAX ? ATTACK_CHANCE_MIN : (diff >= DIFF_MIN ? ATTACK_CHANCE_MED : ATTACK_CHANCE_MAX);
  }

  /**
   * Add spoils to the party for the character opening a cursed chest.
   *
   * @param {Character} character - The character opening the chest.
   *
   * @return {string}
   */
  async addChestSpoils(character) {
    let activeMembers = 0;
    for (let member of this.otherActiveMembers(character)) {
      await character.connection.query('UPDATE characters SET scales = scales + 1 WHERE id = ?', [member.id]);

      const partyCharacter = character.slashbot.getNpc('party', member);
      character.slashbot.dm(`Your party member, ${character.getTrueName()}, has opened a Cursed Chest and shared a Dragon Scale with you to celebrate!`, partyCharacter);
      activeMembers++;
    }

    this.incrementStat(character.connection, STAT_CHESTS_OPENED);

    return activeMembers > 0
      ? `\n\n${activeMembers} of your party are active, and they each get 1 extra Dragon Scale from your Chest!`
      : 'None of your party are active, and they all miss out on the Dragon Scale bonus from opening your Chest!';
  }

  /**
   * Add bonus rewards to a party for a character mastering a profession.
   *
   * @param {Character} character - The character mastering a profession.
   *
   * @return {string}
   */
  async addMasteryBonus(character) {
    let activeMembers = 0;
    for (let member of this.otherActiveMembers(character)) {
      await character.connection.query('UPDATE professions SET sp = sp + 25 WHERE character_id = ? AND TYPE = (SELECT profession FROM characters WHERE id = ?) COLLATE utf8mb4_general_ci;', [member.id, member.id]);

      const partyCharacter = character.slashbot.getNpc('party', member);
      character.slashbot.dm(`Your party member, ${character.getTrueName()}, has mastered ${character.profession.getDisplayName()} and shared 25 SP with you to celebrate!`, partyCharacter);
      activeMembers++;
    }

    this.incrementStat(character.connection, STAT_PROFESSIONS_MASTERED);

    return activeMembers > 0
      ? ` - ${activeMembers} of your party are active, and they each get an extra 25 SP to celebrate!`
      : ' - None of your party are active, and they all miss out on the SP bonus from you mastering your profession!';
  }

  /**
   * Add bonus rewards to a party for a character improving their master of a profession.
   *
   * @param {Character} character - The character improving their master of a profession.
   *
   * @return {string}
   */
  async addImprovedMasteryBonus(character) {
    let activeMembers = 0;
    for (let member of this.otherActiveMembers(character)) {
      await character.connection.query('UPDATE professions SET sp = sp + 25 WHERE character_id = ? AND TYPE = (SELECT profession FROM characters WHERE id = ?) COLLATE utf8mb4_general_ci;', [member.id, member.id]);

      const partyCharacter = character.slashbot.getNpc('party', member);
      character.slashbot.dm(`Your party member, ${character.getTrueName()}, has improved their mastery of ${character.profession.getDisplayName()} and shared 25 SP with you to celebrate!`, partyCharacter);
      activeMembers++;
    }

    this.incrementStat(character.connection, STAT_PROFESSIONS_MASTERED);

    return activeMembers > 0
      ? ` - ${activeMembers} of your party are active, and they each get an extra 25 SP to celebrate!`
      : ' - None of your party are active, and they all miss out on the SP bonus from you improving your mastery!';
  }

  /**
   * Kick a member from the party.
   *
   * @param {integer} memberId - The ID of the member to kick.
   */
  kickMember(memberId) {
    delete this.members[memberId];
    this.modified = true;
  }

  /**
   * Promote a member to leader of the party.
   *
   * Have to do a direct DB update, since saving a modified party would fail (as you wouldn't be
   * party leader anymore).  This is safe though, since only one player can be the leader at a time.
   *
   * @param {Character} character - The character doing the promoting.
   * @param {integer} memberId - The ID of the member to promote.
   */
  async promoteMember(character, memberId) {
    await character.connection.query('UPDATE parties SET leader_id = ? WHERE id = ?', [
      memberId,
      this.id
    ]);

    // Make sure to change leader to ensure updated buttons on this invocation
    this.leader = this.members[memberId];
  }
}

module.exports = Party;