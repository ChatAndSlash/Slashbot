"use strict";

const moment = require('moment');
const Hashids = require('hashids');
const { Actions, Attachments, Dialog } = require('slacksimple');
const Party = require('@app/party');
const { Encounter } = require('@app/content/encounters');
const { STD_DELAY, COLORS, CHARACTER_STATE } = require('@constants');
const { size, get } = require('lodash');

const COMMAND_NAME = 'encounter';

const ENCOUNTER_NAME                  = 'party_master';
const ACTION_LEAVE                    = 'leave';
const ACTION_SHOW_INVITE_DIALOG       = 'show_invite_dialog';
const ACTION_SHOW_CREATE_PARTY_DIALOG = 'show_create_party_dialog';
const ACTION_DIALOG                   = 'dialog_submission';
const ACTION_PROMOTE                  = 'promote';
const ACTION_KICK                     = 'kick';
const ACTION_QUIT                     = 'quit';
const ACTION_DISBAND                  = 'disband';

const ACTION_JOIN = 'join';
const ACTION_NAH  = 'nah';

const MAX_PARTY_MEMBERS = 5;
const MIN_PARTY_MEMBERS = 1;

/**
 * The party master, who will let you form and manage a party.
 */
class PartyMasterEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: 'As you approach, you can hear a steady beat and regular baseline and can see the Party Master flailing and gyrating in what you could charitably call dancing.  "Hey yo!" he calls out to you.  "Lemme tell you all about _parties!_"',
    });
  }

  /**
   * Get the image for this encounter.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/party_master.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return ": Party Master";
  }

  /**
   * Get the description for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = this._description;

    if (character.party) {
      description += `\n\nYour party (${character.party.name}):\n`;

      const leaderText = character.party.isLeader(character)
        ? " *(Leader)*"
        : '';
      description += `> - ${character.getTrueName()} ${leaderText}\n`;

      for (let member of character.party.otherMembers(character)) {
        const activeText = member.isActive()
          ? "(Active)"
          : `(Last active: ${moment().to(moment(member.updatedAt))})`;
        const leaderText = character.party.isLeader(member)
          ? " *(Leader)*"
          : '';

        description += `> - ${member.getTrueName()} ${activeText}${leaderText}\n`;
      }
    }
    else {
      const inviteCode = this.getInviteCode(character);
      description += `\n\n"I can see you're not yet in a party, but if you're looking to join one, your invite code is \`${inviteCode}\`. Tell that to anyone who wants to invite you - they'll know what to do!"`;
    }

    return description;
  }

  /**
   * Get the action buttons for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {array}
   */
  getActions(character) {
    let actions = new Actions();

    if (character.party) {
      if (character.party.isLeader(character)) {
        if (size(character.party.members) < MAX_PARTY_MEMBERS) {
          actions = this.addInviteButton(actions);
        }
        if (size(character.party.members) > MIN_PARTY_MEMBERS) {
          actions = this.addKickButton(actions);
          actions = this.addPromoteButton(actions);
        }
        if (size(character.party.members) === 1) {
          actions = this.addDisbandButton(actions, character);
        }
      }
      else {
        actions = this.addQuitButton(actions, character);
      }

      actions = this.addBuffsButton(actions);
    }
    else {
      actions = this.addCreatePartyButton(actions);
    }

    actions.addButton("Leave", COMMAND_NAME, { params: { type: ENCOUNTER_NAME,  action: ACTION_LEAVE } });

    return actions;
  }

  /**
   * Add an Invite button to the action buttons.
   *
   * @param {Actions} actions - The actions to add to.
   *
   * @return {Actions}
   */
  addInviteButton(actions) {
    actions.addButton(
      `Invite New Member`,
      COMMAND_NAME,
      {
        confirm: {
          title: `Invite a new party member?`,
          text: 'Choose who you want to invite by entering the invite code for the party member you wish to invite.  The Party Master will tell you you invite code if you are not yet in a party.',
          ok_text: "Invite",
          dismiss_text: "Nevermind"
        },
        params: {
          type: ENCOUNTER_NAME,
          action: ACTION_SHOW_INVITE_DIALOG
        }
      }
    );

    return actions;
  }

  /**
   * Add a Create Party button to the action buttons.
   *
   * @param {Actions} actions - The actions to add to.
   *
   * @return {Actions}
   */
  addCreatePartyButton(actions) {
    actions.addButton(
      `Create Party`,
      COMMAND_NAME,
      {
        params: {
          type: ENCOUNTER_NAME,
          action: ACTION_SHOW_CREATE_PARTY_DIALOG,
        }
      }
    );

    return actions;
  }

  /**
   * Add a Kick button to the action buttons.
   *
   * @param {Actions} actions - The actions to add to.
   *
   * @return {Actions}
   */
  addKickButton(actions) {
    actions.addButton("Kick member", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_KICK } } );

    return actions;
  }

  /**
   * Add a Promote button to the action buttons.
   *
   * @param {Actions} actions - The actions to add to.
   *
   * @return {Actions}
   */
  addPromoteButton(actions) {
    actions.addButton("Promote member", "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_PROMOTE } } );

    return actions;
  }

  /**
   * Add a Quit Party button to the action buttons.
   *
   * @param {Actions} actions - The actions to add to.
   * @param {Character} character - The character doing the quitting.
   *
   * @return {Actions}
   */
  addQuitButton(actions, character) {
    actions.addButton("Quit Party", "encounter", {
      params: {
        type: ENCOUNTER_NAME, action: ACTION_QUIT
      },
      confirm: {
        title: `Are you sure you want to quit '${character.party.name}'?`,
        text: `If you quit this party, you'll lose any boosts the party has, and you'll stop receiving bonuses when party members open chests or master professions.`,
        ok_text: "Quit",
        dismiss_text: "Stay"
      }
    });

    return actions;
  }

  /**
   * Add a Disband Party button to the action buttons.
   *
   * @param {Actions} actions - The actions to add to.
   * @param {Character} character - The character doing the disbanding.
   *
   * @return {Actions}
   */
  addDisbandButton(actions, character) {
    actions.addButton("Disband Party", "encounter", {
      params: {
        type: ENCOUNTER_NAME, action: ACTION_DISBAND
      },
      confirm: {
        title: `Are you sure you want to disband '${character.party.name}'?`,
        text: `If you disband this party, you'll lose any boosts the party has.`,
        ok_text: "Disband",
        dismiss_text: "Stay"
      }
    });

    return actions;
  }

  /**
   * Add a Buffs button to the action buttons.
   *
   * @param {Actions} actions - The actions to add to.
   *
   * @return {Actions}
   */
  addBuffsButton(actions) {
    return actions;
  }

  /**
   * Show buttons for your party members.
   *
   * @param {Character} character - The character to show party buttons for.
   * @param {string} action - The action being performed with these buttons.
   * @param {string} title - The title to display for this action.
   */
  async showPartyButtons(character, action, title) {
    let actions = new Actions();

    for (let member of character.party.otherMembers(character)) {
      actions.addButton(member.getTrueName(), COMMAND_NAME, { params: { action, member_id: member.id } });
    }

    actions.addButton("Cancel", "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      attachments: Attachments.one({
        title,
        fields: this.character.getFields(),
        actions
      })
    });
  }

  /**
   * Get the code for a character to invite them to a party.
   *
   * @param {Character} character - The character to get the invite code for.
   *
   * @return {string}
   */
  getInviteCode(character) {
    const hashids = new Hashids(process.env.PARTY_HASHID_SALT, 10);

    return hashids.encode(character.id);
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    if (ACTION_SHOW_INVITE_DIALOG === action) {
      this.showInviteDialog(character, message);
    }
    else if (ACTION_SHOW_CREATE_PARTY_DIALOG === action) {
      this.showCreatePartyDialog(character, message);
    }
    else if (ACTION_DIALOG === action) {
      await this.submitDialog(character, message);
    }
    else if (ACTION_KICK === action) {
      const memberId = this.info.member_id;
      if (memberId) {
        await this.doKick(character, memberId);
      }
      else {
        await this.showPartyButtons(character, ACTION_KICK, "Who do you want to kick from the party?");
      }
    }
    else if (ACTION_PROMOTE === action) {
      const memberId = this.info.member_id;
      if (memberId) {
        await this.doPromote(character, memberId);
      }
      else {
        await this.showPartyButtons(character, ACTION_PROMOTE, "Who do you want to promote to leader of the party?");
      }
    }
    else if (ACTION_LEAVE === action) {
      character.state = CHARACTER_STATE.IDLE;
      await this.updateLast({
        attachments: Attachments.one({
          title: "You leave the Party Master, rockin' to his party beat.",
        }),
        doLook: true
      });
    }
    else if (ACTION_QUIT === action) {
      await this.doQuit(character);
    }
    else if (ACTION_DISBAND === action) {
      await this.doDisband(character);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }
  }

  /**
   * Kick a character from the party.
   *
   * @param {Character} character - The character to kick from the party.
   * @param {integer} memberId - The ID of the party member to kick.
   */
  async doKick(character, memberId) {
    const title = `You remove ${character.party.members[memberId].getTrueName()} from your party.`;
    character.party.kickMember(memberId);

    await this.updateLast({
      attachments: Attachments.one({
        title,
      }),
      doLook: true
    });
  }

  /**
   * Promote a different member to leader of the party.
   *
   * @param {Character} character - The character doing the promoting.
   * @param {integer} memberId - The member to promote.
   */
  async doPromote(character, memberId) {
    const title = `You promote ${character.party.members[memberId].getTrueName()} to leader of the party.`;
    await character.party.promoteMember(character, memberId);

    await this.updateLast({
      attachments: Attachments.one({
        title,
      }),
      doLook: true
    });
  }

  /**
   * Quit the party the character is in.
   *
   * @param {Character} character - The character quitting the party.
   *
   * @return {Character}
   */
  async doQuit(character) {
    // Remove character from party in DB
    await character.connection.query('DELETE FROM party_members WHERE party_id = ? AND character_id = ?', [
      character.party.id,
      character.id
    ]);

    // Let other members know you bailed
    for (let otherMember of character.party.otherMembers(character)) {
      const otherPartyCharacter = character.slashbot.getNpc('party', otherMember);
      character.slashbot.dm(
        `${character.getTrueName()} has left your party.`,
        otherPartyCharacter,
      );
    }

    // Set party to false so buttons display correctly
    const title = `You decide to head out on your own and quit '${character.party.name}'.`;
    character.party = false;

    // Update message
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Disband the party this character is in.
   *
   * @param {Character} character - The character disbanding the party.
   */
  async doDisband(character) {
    // Remove party members & party
    await character.connection.query('DELETE FROM party_members WHERE party_id = ?', [character.party.id]);
    await character.connection.query('DELETE FROM parties WHERE id = ?', [character.party.id]);

    // Set party to false so buttons display correctly
    const title = `You disband '${character.party.name}'.`;
    character.party = false;

    // Update message
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Show dialog to request message to invite party member.
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  showInviteDialog(character, message) {
    const dialog = new Dialog('Invite new party member', character.token);
    dialog.addTextElement('Invite code', 'invite_code');

    character.slashbot.dialog(
      this.triggerId,
      character,
      dialog,
    );
  }

  /**
   * Show dialog to request message to create party.
   *
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  showCreatePartyDialog(character, message) {
    const dialog = new Dialog('Create party', character.token);
    dialog.addTextElement('Party name', 'party_name');

    character.slashbot.dialog(
      this.triggerId,
      character,
      dialog,
    );
  }

  /**
   * User has submitted dialog.
   *
   * @param {Character} character - The character performing the action.
   */
  async submitDialog(character) {
    if (get(this.info.values, 'invite_code', false)) {
      await this.submitInviteDialog(character);
    }
    else if (get(this.info.values, 'party_name', false)) {
      await this.submitCreatePartyDialog(character);
    }
    else {
      throw new Error('Unknown dialog type.');
    }
  }

  /**
   * User has submitted dialog to invite player.
   *
   * @param {Character} character - The character performing the action.
   */
  async submitInviteDialog(character) {
    const inviteCode = this.info.values.invite_code;
    const hashids = new Hashids(process.env.PARTY_HASHID_SALT, 10);
    const decoded = hashids.decode(inviteCode);

    // Invalid invite code
    if (decoded.length === 0) {
      character.slashbot.say('', character, {
        attachments: Attachments.one({
          title: `'${inviteCode}' is not a valid invite code.`,
          color: COLORS.DANGER
        }),
      });
      character.slashbot.doCommand('look', character, { delay: STD_DELAY });
    }
    // Valid invite code
    else {
      // Gotta require late, to prevent circular references
      const Character = require('@app/character').Character;

      let newMember = new Character();
      await newMember.load({ id: decoded[0] }, character.slashbot, character.queueSuffix);

      if (newMember.party) {
        character.slashbot.say('', character, {
          attachments: Attachments.one({
            title: `'${newMember.getTrueName()}' is already in a party.`,
            color: COLORS.DANGER
          }),
        });
        character.slashbot.doCommand('look', character, { delay: STD_DELAY });
      }
      else {
        let actions = new Actions();
        actions.addButton("Join Party", "party_invite", { params: { action: ACTION_JOIN, party_id: character.party.id } } );
        actions.addButton("Nah", "party_invite", { params: { action: ACTION_NAH, party_id: character.party.id } } );

        const partyCharacter = character.slashbot.getNpc('party', newMember);
        character.slashbot.dm(
          `Your have been invited to join ${character.getTrueName()}'s party: ${character.party.name}!`,
          partyCharacter,
          { attachments: Attachments.one({ title: 'Do you wish you join this party?', actions }) }
        );

        character.slashbot.say('', character, {
          attachments: Attachments.one({
            title: `You have invited ${newMember.getTrueName()} to join your party.`,
            color: COLORS.GOOD
          }),
        });
        character.slashbot.doCommand('look', character, { delay: STD_DELAY });
      }
    }
  }

  /**
   * User has submitted dialog to create party.
   *
   * @param {Character} character - The character performing the action.
   */
  async submitCreatePartyDialog(character) {
    const partyName = this.info.values.party_name;

    // Create party
    const [result, ] = await character.connection.query(`INSERT INTO parties SET leader_id = ?, name = ?, stats = '{}', boosts = '[]', flags = '{}'`, [
      character.id,
      partyName,
    ]);
    const partyId = result.insertId;
    await character.connection.query('INSERT INTO party_members (party_id, character_id) VALUES (?, ?)', [
      partyId,
      character.id
    ]);

    // Set character's party so that the buttons display correctly
    character.party = new Party({
      id: partyId,
      name: partyName,
      leader: character,
      members: {
        [character.id]: character
      },
    });

    // Update message
    character.slashbot.say('', character, {
      attachments: Attachments.one({
        title: `You have created the party: '${partyName}'.`,
        color: COLORS.GOOD
      }),
    });
    character.slashbot.doCommand('look', character, { delay: STD_DELAY });
  }
}

module.exports = PartyMasterEncounter;