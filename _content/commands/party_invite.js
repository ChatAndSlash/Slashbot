"use strict";

const { Command } = require('@app/content/commands');
const { Attachments } = require('slacksimple');
const Party = require('@app/party');

const ACTION_JOIN = 'join';
const ACTION_NAH  = 'nah';

const MAX_PARTY_MEMBERS = 5;

/**
 * Respond to a party invite.
 */
class PartyInviteCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === ACTION_JOIN) {
      await this.doJoin(this.character, this.info.party_id);
    }
    else if (this.info.action === ACTION_NAH) {
      await this.doNah(this.character, this.info.party_id);
    }
    else {
      throw new Error(`Invalid action '${this.info.action}'.`);
    }
  }

  /**
   * Join a party.
   *
   * @param {Character} character - The character joining the party.
   * @param {integer} partyId - The ID of the party to join.
   */
  async doJoin(character, partyId) {
    // Can't join a party if you're already in one!
    if (character.party) {
      return await character.slashbot.update(
        this.message,
        this.message.text,
        character,
        Attachments.one({ title: `You're already in a party.  If you want to join this new one, you'll need to leave the old one first.` }),
        { overrideChannel: this.message.channel_id },
      );
    }

    // Get all rows for party members in this character's party
    const [memberRows, ] = await character.connection.query('SELECT * FROM party_members WHERE party_id = ?', [partyId]);

    // Party is full
    if (memberRows.length >= MAX_PARTY_MEMBERS) {
      await character.slashbot.update(
        this.message,
        this.message.text,
        character,
        Attachments.one({ title: `Whoops, sorry!  That party is full.` }),
        { overrideChannel: this.message.channel_id },
      );
    }
    // Party doesn't exist
    else if (memberRows.length === 0) {
      await character.slashbot.update(
        this.message,
        this.message.text,
        character,
        Attachments.one({ title: `Could not find that party.  Maybe it disbanded?` }),
        { overrideChannel: this.message.channel_id },
      );
    }
    // Party can be joined
    else {
      // Join party
      await character.connection.query('INSERT INTO party_members (party_id, character_id) VALUES (?, ?)', [
        partyId,
        character.id
      ]);
      const party = await Party.load(character, character.connection);

      // Update message
      await character.slashbot.update(
        this.message,
        this.message.text,
        character,
        Attachments.one({ title: `You have joined ${party.name}!` }),
        { overrideChannel: this.message.channel_id },
      );

      // Inform leader
      const leaderPartyCharacter = character.slashbot.getNpc('party', party.leader);
      character.slashbot.dm(
        `${character.getTrueName()} has joined your party!`,
        leaderPartyCharacter,
      );
    }
  }

  /**
   * Don't join a party.
   *
   * @param {Character} character - The character joining the party.
   * @param {integer} partyId - The ID of the party to join.
   */
  async doNah(character, partyId) {
    // Inform leader
    const leader = await Party.getLeader(partyId, character, character.connection);
    const leaderPartyCharacter = character.slashbot.getNpc('party', leader);
    character.slashbot.dm(
      `${character.getTrueName()} has declined to join your party.`,
      leaderPartyCharacter,
    );

    // Update message
    await character.slashbot.update(
      this.message,
      this.message.text,
      character,
      Attachments.one({ title: 'Okay.  Maybe next time.' }),
      { overrideChannel: this.message.channel_id },
    );
  }

}

module.exports = PartyInviteCommand;