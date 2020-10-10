"use strict";

const Hashids     = require('hashids');
const Log         = require('@util/log');
const Character   = require('@app/character').Character;
const Commands    = require('@app/content/commands').Commands;
const Attachments = require('slacksimple').Attachments;
const Actions     = require('slacksimple').Actions;
const Raven       = require('raven');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const IMG_ROOT        = require('@constants').IMG_ROOT;
const FLAGS           = require('@constants').FLAGS;
const STATS           = require('@constants').STATS;

const EVENT_QUEUE  = 'event_queue';

const CHANNEL_TYPE_DIRECT_MESSAGE = 'directmessage';

class Slashbot {
  /**
   * Initialize bot.
   *
   * @param {string} mqUrl - The URL to use when connecting to the MQ.
   */
  constructor(mqUrl) {
    this.mqUrl = mqUrl;
    this.amqp = require('amqplib');
  }

  /**
   * Connect to the MQ.
   */
  async connect() {
    try {
      Log.info('Connecting to MQ...');
      this.mqConnection = await this.amqp.connect(this.mqUrl);
      this.channel = await this.mqConnection.createChannel();
      Log.info('Connected to MQ.');

      for (const suffix of process.env.QUEUE_SUFFIXES.split(',')) {
        this.channel.assertQueue(`in_queue-${suffix}`);
        this.channel.consume(`in_queue-${suffix}`, this.onConsume.bind(this), { noAck: true });

        this.channel.assertExchange(`out_exchange-${suffix}`, 'x-delayed-message', { autoDelete: false, durable: true, passive: true,  arguments: { 'x-delayed-type':  'direct' } });
        this.channel.bindQueue(`out_queue-${suffix}`, `out_exchange-${suffix}`, `out_queue-${suffix}`);
      }
    }
    catch (e) {
      Log.error(e);
    }
  }

  /**
   * Called every time we consume a new message from the in queue.
   *
   * @param {string} message - The message from the queue
   */
  async onConsume(message) {
    try {
      const routingKey = message.fields.routingKey;
      const queueSuffix = routingKey.substr(routingKey.indexOf("-") + 1);
      await this.dequeue(JSON.parse(message.content.toString()), queueSuffix);
    }
    catch (e) {
      Log.error(e);
      Log.error(message.toString());
    }
  }

  /**
   * Enqueue a message in the out queue.
   *
   * @param {object} msg - The message to enqueue.
   * @param {string} queueSuffix - The suffix of the queue to send this to.
   * @param {integer} delay - The number of milliseconds to delay this message.
   */
  enqueue(msg, queueSuffix, delay = 0) {
    const outQueue = `out_queue-${queueSuffix}`;
    const outExchange = `out_exchange-${queueSuffix}`;

    Log.debug(msg, `Enqueued message for queue '${outQueue}'.`);

    this.channel.publish(outExchange, outQueue, Buffer.from(JSON.stringify(msg)), { headers: { "x-delay": delay } });
  }

  /**
   * Add an event to the event queue.
   *
   * @param {string} event - The type of event to enqueue.
   * @param {integer} characterId - The ID of the character triggering this event.
   * @param {object} fields - The fields of the event.
   */
  enqueueEvent(event, characterId, fields) {
    this.channel.assertQueue(EVENT_QUEUE);
    this.channel.sendToQueue(EVENT_QUEUE, Buffer.from(JSON.stringify({
      event,
      character_id: characterId,
      fields
    })));
  }

  /**
   * Dequeue a message from the MQ.
   *
   * @param {object} msg - The message to dequeue.
   * @param {string} queueSuffix - The suffix of the queue this message came from.
   */
  async dequeue(msg, queueSuffix) {
    if ('button' === msg.type) {
      if (_.get(msg.payload, 'type') === 'dialog_submission') {
        await this.onDialog(msg.payload, queueSuffix);
      }
      else {
        await this.onButton(msg.payload, queueSuffix);
      }
    }
    else if ('slash' === msg.type) {
      await this.onSlash(msg.payload, queueSuffix);
    }
    else if ('new-game' === msg.type) {
      await this.onNewGame(msg.payload, queueSuffix);
    }
    else if ('payment' === msg.type) {
      await this.onPayment(msg.payload, queueSuffix);
    }
    else if ('add_timestamp' === msg.type) {
      this.onAddTimestamp(msg.payload, queueSuffix);
    }
    else {
      Log.error(msg, "Could not identify message type.");
    }
  }

  /**
   * Tell a story to a charcter.
   *
   * Story format: (params in parens are optional)
   * [
   *     { (npc: 'narrator'), text: 'story text' },
   *     { (npc: 'narrator'), text: 'story text' },
   *     ...
   *     { (npc: 'narrator'), text: 'story text', (buttonText: 'Continue", color: 'good') },
   * ]
   *
   * @param {array} story - The story to tell.
   * @param {Character} character - The character to tell it to.
   */
  tellStory(story, character) {
    // Tell all the story except the final part
    for (let idx = 0; idx < story.length - 1; idx++) {
      if (story[idx] instanceof Object) {
        this.say(story[idx].text, this.getNpc(_.get(story[idx], "npc", "narrator"), character), { messageDelay:  idx * 5, typing: true });
      }
      else {
        this.say(story[idx], this.getNpc("narrator", character), { messageDelay:  idx * 5, typing: true });
      }
    }

    // Button is required to get out of cutscene and get back to game.
    const final = story.length - 1;
    this.say(
      _.get(story[final], 'text', story[final]),
      this.getNpc(_.get(story[final], "npc", "narrator"), character), {
        attachments: Attachments.one({
          title: _.get(story[final], "title", " "),
          color: _.get(story[final], "color", "good"),
          actions: Actions.oneButton(_.get(story[final], "buttonText", "Continue"), _.get(story[final], 'buttonAction', 'continue'), { params: _.get(story[final], 'buttonParams', {})})
        }),
        messageDelay: story.length * 5
      }
    );
  }

  /**
   * Create a character.
   *
   * @param {string} uid - The Slack UID of the new character.
   * @param {string} teamid - The ID of the team the user is on.
   * @param {string} name - The name of the new character.
   * @param {string} email - The email of the new character.
   * @param {string} channel - The channel of the new character.
   * @param {string} queueSuffix - The suffix for the queue this character was loaded from.
   *
   * @return {Character}
   */
  async createCharacter(uid, teamid, name, email, channel, queueSuffix) {
    await Character.create(uid, teamid, name, email, channel);
    const character = await this.getLoadedCharacter({ uid, teamid }, queueSuffix);

    this.enqueueEvent("Profile", character.id, { email, name });

    return character;
  }

  /**
   * Instantiate and load a character according to conditions.
   *
   * @param {object} where - Parameters to use to narrow down the character to load.
   * @param {string} queueSuffix - The suffix for the queue this character was loaded from.
   *
   * @return {Character}
   */
  async getLoadedCharacter(where, queueSuffix) {
    let character = new Character();
    return await character.load(where, this, queueSuffix);
  }

  /**
   * Write a message to a character, queueing to avoid rate limiting.
   *
   * @param {string} text - The message to write.
   * @param {Character} character - The character to speak to.
   * @param {object} attachments - Attachments for more formatting.
   * @param {integer} messageDelay - Seconds to delay before sending this message.
   * @param {boolean} typing - If we should display the "typing" indicator with this message.
   */
  say(text, character, { attachments = false, messageDelay = 0, typing = false } = {}) {
    if (_.isUndefined(character.teamid)) {
      Log.error({ char: character }, "Invalid character, no team.");
      throw new Error("Invalid character, no team.");
    }

    if (_.isUndefined(character.queueSuffix)) {
      Log.error({ char: character }, "Invalid character, no queue suffix.");
      throw new Error("Invalid character, no queue suffix.");
    }

    this.enqueue({
      type: 'say',
      channel: character.channel,
      team: character.teamid,
      uid: character.uid,
      text,
      opts: this._getMessageOptions(character, attachments),
      typing
    }, character.queueSuffix, Math.ceil(messageDelay * 1000));
  }

  /**
   * Send a dialog to a character.
   *
   * @param {string} triggerId - The trigger ID of the message triggering the dialog.
   * @param {Character} character - The character to send the dialog to.
   * @param {Dialog} dialog - The dialog to send.
   */
  dialog(triggerId, character, dialog) {
    this.enqueue({
      type: 'dialog',
      team: character.teamid,
      triggerId,
      dialog: dialog.getDialog(),
    }, character.queueSuffix);
  }

  /**
   * Queue up a direct message to a player.
   *
   * @param {string} text - The message to write.
   * @param {Character} character - The character to speak to the player of.
   * @param {object} attachments - Attachments for more formatting.
   * @param {integer} messageDelay - Seconds to delay before sending this message.
   */
  dm(text, character, { attachments = false, messageDelay = 0 } = {}) {
    this.enqueue({
      type: 'dm',
      uid: character.uid,
      team: character.teamid,
      channel: 'dm',
      text,
      opts: this._getMessageOptions(character, attachments),
    }, character.queueSuffix, Math.ceil(messageDelay * 1000));
  }

  /**
   * Update a message previously sent to a player, without waiting in the queue.
   *
   * @param {object} message - The message to update.
   * @param {string} text - The text to update.
   * @param {Character} character - The character to speak to the player of.
   * @param {object} attachments - Attachments for more formatting.
   * @param {string} overrideChannel - A channel that overrides the character's default channel.
   */
  update(message, text, character, attachments, { overrideChannel = character.channel } = {}) {
    this.enqueue({
      type: 'update',
      ts: message.ts,
      channel: overrideChannel,
      team: character.teamid,
      uid: character.uid,
      text,
      opts: this._getMessageOptions(character, attachments)
    }, character.queueSuffix);
  }

  /**
   * Delete a message previously sent to a player, without waiting in the queue.
   *
   * @param {string} ts - The timestamp of the message to delete.
   * @param {Character} character - The character to speak to the player of.
   * @param {object} attachments - Attachments for more formatting.
   */
  delete(ts, character) {
    this.enqueue({
      type: 'delete',
      ts: ts,
      channel: character.channel,
      team: character.teamid,
    }, character.queueSuffix);
  }

  /**
   * Log the error and report to the user that something has happened.
   *
   * @param {Error} err - The error that happened.
   * @param {string} channel - The channel to report error to.
   * @param {string} teamid - The team to report error to.
   * @param {string} queueSuffix - The suffix of the queue to pass this error to.
   */
  sayError(err, channel, teamid, queueSuffix) {
    const errorCharacter = {
      plain: true,
      channel,
      teamid,
      queueSuffix,
    };

    this.say("Hm, that request... confused me.  Wait a moment, then try again.", errorCharacter);
  }

  /**
   * Report an error to Sentry, but not in development mode.
   *
   * @param {Error} error - The error to report.
   * @param {Character} character - The character that experienced the error.
   * @param {string} command - The command being executed when the error occurred.
   * @param {object} info - Command parameters.
   */
  reportError(error, character, command, info) {
    if ('dev' === process.env.MODE) {
      Log.info("Reporting error...");
    }
    else {
      Raven.captureException(error, {
        user: character.logInfo(),
        extra: { command, info }
      });
    }
  }

  /**
   * Get an NPC character to use for cutscenes.
   *
   * @param {string} name - The name of the character to get.
   * @param {Character} character - The character the NPC is being generated for.
   *
   * @return {object}
   */
  getNpc(name, character) {
    let npc = {
      channel: character.channel,
      uid: character.uid,
      teamid: character.teamid,
      token: character.token,
      queueSuffix: character.queueSuffix,
    };

    if ('phaera' === name) {
      npc = _.extend(npc, {
        overrideName: 'Phaera, the Great Phoenix',
        overrideImage: IMG_ROOT + 'characters/phaera.png',
      });
    }
    else if ('narrator' === name) {
      npc = _.extend(npc, {
        overrideName: 'Narrator',
        overrideImage: IMG_ROOT + 'characters/narrator.png',
      });
    }
    else if ('winged_woman' === name) {
      npc = _.extend(npc, {
        overrideName: 'Winged Woman',
        overrideImage: IMG_ROOT + 'characters/phaera.png',
      });
    }
    else if ('obsidia' === name) {
      npc = _.extend(npc, {
        overrideName: 'Obsidia',
        overrideImage: IMG_ROOT + 'characters/obsidia.png',
      });
    }
    else if ('aureth' === name) {
      npc = _.extend(npc, {
        overrideName: 'Aureth',
        overrideImage: IMG_ROOT + 'characters/aureth.png',
      });
    }
    else if ('present' === name) {
      npc = _.extend(npc, {
        overrideName: 'A Present!',
        overrideImage: IMG_ROOT + 'characters/present.png',
      });
    }
    else if ('party' === name) {
      npc = _.extend(npc, {
        overrideName: 'Party Reward!',
        overrideImage: IMG_ROOT + 'characters/party.png',
      });
    }
    else {
      throw new Error(`Unknown NPC: '${name}'`);
    }

    return npc;
  }

  /**
   * Parse the payload information from a button press.
   *
   * @param {object} payload - The payload to parse.
   *
   * @return {[command, info, logInfo]}
   */
  parseButtonPayload(payload) {
    // "value" comes from buttons, "selected_options" comes from selects
    const action  = payload.actions[0];
    const value   = _.get(action, "value", _.get(action, 'selected_options', [{ value: '' }])[0].value);
    const pipePos = value.indexOf('|');

    let command = '';
    let info    = {};

    if (pipePos >= 0) {
      command = value.substring(0, pipePos);
      info    = JSON.parse(value.substring(pipePos + 1));
    }
    else {
      command = value;
    }

    let logInfo = {
      uid: payload.user.id,
      teamid: payload.team.id,
      command,
      info: _.clone(info),
    };

    // Add message timestamp for updating existing messages
    info.message_ts = payload.message_ts;

    return [command, info, logInfo];
  }

  /**
   * Ensure characters are issuing commands in their channels only.
   *
   * @param {Character} character - The character to check.
   * @param {object} payload - The payload of the command to check.
   *
   * @return boolean
   */
  isCorrectChannel(character, payload) {
    // Checking a button or dialog
    if ('channel' in payload && character.uid !== payload.user.id) {
      Log.warn(`User '${payload.user.id}' tried to press a button in incorrect channel '${payload.channel.id}'.`);
      return false;
    }
    // Checking a slash command
    else if ('channel_id' in payload && character.uid !== payload.user_id) {
      Log.warn(`User '${payload.user_id}' tried to issue a slash command in incorrect channel '${payload.channel_id}'.`);
      return false;
    }

    return true;
  }

  /**
   * Check to see if the button being pressed is the most-recent button or an old one.
   *
   * @param {Character} character - The character pressing the button.
   * @param {string} callbackId - The callback ID of the command.
   *
   * @return boolean
   */
  isCurrentButton(character, callbackId) {
    return character.token === callbackId;
  }

  /**
   * Check to see if the character is in a cutscene.
   *
   * @param {Character} character - The character to check.
   *
   * @return boolean
   */
  isInCutscene(character) {
    return character.hasFlag(FLAGS.IN_CUTSCENE);
  }

  /**
   * Update a message with a warning about having clicked an old button.
   *
   * @param {Character} character - The character to issue the warning for.
   * @param {object} message - The message to update.
   */
  warnOnOldButton(character, message) {
    this.update(
      message,
      message.text,
      character,
      Attachments.one({
        title: ":warning: You clicked an old button.  To keep things simple, please only click the newest ones.  Need new buttons?  Type '/look'.",
      })
    );
  }

  async onAddTimestamp(payload, queueSuffix) {
    Log.debug(payload, `Add Timestamp payload (${queueSuffix}):`);

    let character;

    try {
      character = await this.getLoadedCharacter({
        channel: payload.channel,
        teamid: payload.teamid,
      }, queueSuffix);

      character.addTimestamp(payload.ts);
      await character.save();

    }
    catch (err) {
      if (_.isUndefined(character)) {
        character = { logInfo: () => ({ channel: payload.channel, teamid: payload.teamid }), };
      }

      Log.error(err);
      this.reportError(err, character, 'add_timestamp', payload);
    }
  }

  /**
   * Fired when a dialog has been submitted.
   *
   * @param {object} payload - The dialog payload.
   * @param {string} queueSuffix - The suffix of the queue this dialog was submitted from.
   */
  async onDialog(payload, queueSuffix) {
    Log.debug(payload, `Dialog payload (${queueSuffix}):`);

    let character;
    let logInfo = {
      uid: payload.user.id,
      channel: payload.channel.id,
      teamid: payload.team.id,
      command: 'dialog_submission',
      info: _.clone(payload.submission),
    };

    try {
      character = await this.getLoadedCharacter({
        channel: payload.channel.id,
        teamid: payload.team.id,
      }, queueSuffix);

      if ( ! this.isCorrectChannel(character, payload)) {
        this.say("Only the player that started the game in this channel may issue commands.  Looking to play?  Create a private channel, type `/invite @chatandslash`, and then `/chatandslash` to start!", this.getNpc('narrator', character));
        return;
      }

      character.generateNewToken();

      await this.doCommand('encounter', character, { info: {
        action: 'dialog_submission',
        values: payload.submission,
      }, });
      await character.save();

      this.logCommand(logInfo, "Dialog:", character);
    }
    catch (error) {
      Log.error(logInfo, error, 'Button:');

      if (_.isUndefined(character)) {
        character = { logInfo: () => ({ uid: payload.user.id, teamid: payload.team.id }), };
      }

      this.reportError(error, character, 'dialog_submission', payload);
      this.sayError(error, payload.channel.id, payload.team.id, queueSuffix);
    }
  }

  /**
   * Fired when a button has been pressed.
   *
   * @param {object} payload - The button payload.
   * @param {string} queueSuffix - The suffix of the queue this button was clicked from.
   */
  async onButton(payload, queueSuffix) {
    Log.debug(payload, `Button payload (${queueSuffix}):`);

    let command, info, logInfo, character;

    try {
      [command, info, logInfo] = this.parseButtonPayload(payload);

      // Direct Messages won't have a matching channel
      if (payload.channel.name === CHANNEL_TYPE_DIRECT_MESSAGE) {
        character = await this.getLoadedCharacter({
          uid: payload.user.id,
          teamid: payload.team.id,
        }, queueSuffix);
      }
      // All other channel-bases messages should be fine
      else {
        character = await this.getLoadedCharacter({
          channel: payload.channel.id,
          teamid: payload.team.id,
        }, queueSuffix);
      }

      if ( ! this.isCorrectChannel(character, payload)) {
        this.say("Only the player that started the game in this channel may issue commands.  Looking to play?  Create a private channel, type `/invite @chatandslash`, and then `/chatandslash` to start!", this.getNpc('narrator', character));
        return;
      }

      if (this.shouldWarnOldButton(character, payload)) {
        this.warnOnOldButton(character, payload.original_message);
        command = 'look';
        delete info.message_ts;
      }

      const triggerId = payload.trigger_id;
      const message = {
        ...payload.original_message,
        channel_id: payload.channel.id,
      };

      character.generateNewToken();
      await this.doCommand(command, character, { info, message, triggerId });
      await character.save();

      this.logCommand(logInfo, "Button:", character);
    }
    catch (err) {
      if (err instanceof SyntaxError) {
        Log.error(logInfo, err, "Invalid JSON: " + payload);
        character = { logInfo: () => ({ id: 'unknown character' }) };
        command = 'unknown command';
      }
      else {
        Log.error(logInfo, err, 'Button:');
      }

      if (_.isUndefined(character)) {
        character = { logInfo: () => ({ uid: payload.user.id, teamid: payload.team.id }), };
      }

      this.reportError(err, character, command, payload);
      this.sayError(err, payload.channel.id, payload.team.id, queueSuffix);
    }
  }

  /**
   * If the character should be warned about clicking an old button.
   *
   * @param {Character} character - The character being warned.
   * @param {object} payload - The payload representing the clicked button.
   *
   * @return {boolean}
   */
  shouldWarnOldButton(character, payload) {
    return ! this.isCurrentButton(character, payload.callback_id)
    && ! this.isInCutscene(character)
    && payload.channel.name !== CHANNEL_TYPE_DIRECT_MESSAGE;
  }

  /**
   * Fired when a slash command has been issued.
   *
   * @param {object} payload - The slash command payload.
   * @param {string} queueSuffix - The suffix of the queue this button was clicked from.
   */
  async onSlash(payload, queueSuffix) {
    Log.debug(payload, `Slash payload (${queueSuffix}):`);

    let command, info, character, logInfo;

    try {
      command = payload.command.replace('/', '');
      info    = { text: payload.text.toLowerCase() };
      logInfo = {
        uid: payload.user_id,
        teamid: payload.team_id,
        command,
        info
      };

      character = await this.getLoadedCharacter({
        channel: payload.channel_id,
        teamid: payload.team_id,
      }, queueSuffix);

      if ( ! this.isCorrectChannel(character, payload)) {
        this.say("Only the player that started the game in this channel may issue commands.  Looking to play?  Create a private channel, type `/invite @chatandslash`, and then `/chatandslash` to start!", this.getNpc('narrator', character));
        return;
      }

      // No commands other than "look" for cutscenes allowed
      if (this.isInCutscene(character) && command !== 'look') {
        Log.info(`Character '${character.id}' tried to issue a slash command while in a cutscene.`);
        return;
      }

      await this.doCommand(command, character, { info });

      // Don't save character if twinked or new game started
      if ( ! ['dtwink', 'dnewgame'].includes(command)) {
        await character.save();
      }

      this.logCommand(logInfo, "Slash:", character);
    }
    catch (error) {
      Log.error(logInfo, error, 'Slash:');

      if (_.isUndefined(character)) {
        Log.warn('Slash command issued outside of character channel', payload);
        return;
      }

      this.reportError(error, character, command, payload);
      this.sayError(error, payload.channel_id, payload.team_id, queueSuffix);
    }
  }

  /**
   * Log a successful command.
   *
   * @param {object} logInfo - Existing log information.
   * @param {string} commandType - Button or Slash, the command type.
   * @param {Character} character - The character executing the command.
   */
  logCommand(logInfo, commandType, character) {
    logInfo.id     = character.id;
    logInfo.location = character.location.type;
    logInfo.state    = character.state;

    if (character.state === CHARACTER_STATE.FIGHTING) {
      logInfo.enemy = character.enemy.type;
    }

    Log.info(logInfo, commandType);
  }

  /**
   * A new player has joined!
   *
   * @param {object} payload - The payload with information about the new player.
   * @param {string} queueSuffix - The suffix of the queue this button was clicked from.
   * @param {boolean} tellStory - Whether to tell the intro story or not.
   */
  async onNewGame(payload, queueSuffix, tellStory = true) {
    Log.debug(payload, `New game payload (${queueSuffix}):`);

    let character;
    try {
      character = await this.createCharacter(
        payload.uid,
        payload.teamid,
        payload.name,
        payload.email,
        payload.channel,
        queueSuffix
      );

      if (tellStory) {
        this.tellStory([
          "You never see the attack that kills you, but you feel it.",
          "A lone blade slides into your back from behind, and you slip to the ground as the world grows dark.",
          "The sounds of battle fade around you, and the world becomes grey.",
          "There you seem to float for a while, until eventually, you see a light in the distance.",
          "As it comes closer, it grows in clarity until it becomes a woman with broad wings, wreathed in flame.",
          "She bends down and places her flaming hand gently to your cheek. It warms you, but does not burn.",
          "Her voice is like summer honey.",
          { npc: "winged_woman", text: "I am truly sorry, but you cannot rest just now. I need your help.", title: "You have so many questions, but foremost in your mind is:", buttonText: "Who are you?", buttonAction: "intro", buttonParams: {"stage": "1"} }
        ], character);
      }
    }
    catch (err) {
      Log.error(err, 'NewGame:');

      if (_.isUndefined(character)) {
        character = { logInfo: () => ({ uid: _.get(payload, 'uid'), teamid: _.get(payload, 'teamid') }), };
      }

      this.reportError(err, character, 'NewGame', payload);
      this.sayError(err, _.get(payload, 'channel'), _.get(payload, 'teamid'), queueSuffix);
    }
  }

  /**
   * We got paid!
   *
   * @param {object} payload - The payload with information about the payment.
   * @param {string} queueSuffix - The suffix of the queue this button was clicked from.
   */
  async onPayment(payload, queueSuffix) {
    Log.info(payload, `Payment payload (${queueSuffix}):`);

    const hashids = new Hashids(_.get(process.env, 'HASHID_SALT'), 4);
    const id = hashids.decode(payload.id)[0];

    // Can't decode hashed id?
    if (_.isUndefined(id)) {
      throw new Error(`Cannot decode hashid: '${payload.id}'.`);
    }

    let character = new Character();
    let logInfo;

    try {
      character = await this.getLoadedCharacter({ id }, queueSuffix);

      logInfo = {
        uid: character.uid,
        scales: payload.items.scales,
        price: payload.price
      };

      character.scales += parseInt(payload.items.scales);
      character.increaseStat(STATS.SCALES_PURCHASED, parseInt(payload.items.scales));
      character.increaseStat(STATS.MONEY_SPENT, parseInt(payload.price));

      const presentCharacter = this.getNpc('present', character);

      this.say(`With a burst of flame, a small box appears in front of you.  Curious, you pick it up and open it.  Inside, glittering brightly, are ${payload.items.scales} Dragon Scales.  You tuck your treasure away, silently thanking your ethereal benefactor.`, presentCharacter);
      this.dm(`Your purchase was successful, and your ${payload.items.scales} Dragon Scales have been added to your character!`, presentCharacter);

      await character.save();
      character.track('Purchase Scales', {
        scales: parseInt(payload.items.scales),
        '$sale_value': parseInt(payload.price) / 100,
        '$sale_currency': 'USD',
      });

      Log.info(logInfo, 'Payment:');
    }
    catch (e) {
      if (_.isUndefined(character)) {
        character = { logInfo: () => ({ id }), };
      }

      this.reportError(e, character, 'payment', payload);
      Log.error(logInfo, e, 'Payment:');
    }
  }

  /**
   * Quick shortcut for performing a command.
   *
   * @param {string} commandName - The command to perform.
   * @param {Character} character - The character performing the command.
   * @param {object} info - Info to pass into the command, if any.
   * @param {object} message - The previous message, if any.
   * @param {string} triggerId - The ID of the trigger for the message, if any.
   */
  async doCommand(commandName, character, { info = {}, message = {}, triggerId = '' } = {}) {
    const command = Commands.new(commandName, character, { info, message, triggerId });
    await command.execute();
  }

  /**
   * Get the options for displaying messages sent from the bot.
   *
   * @param {Character} character - The character to send the message to.
   * @param {object} attachments - Optional attachments used to format the message further.
   *
   * @return {object}
   */
  _getMessageOptions(character, attachments) {
    let options = {};

    if (_.isUndefined(character.plain)) {
      options = {
        username: this._getBotName(character),
        icon_url: this._getBotImage(character),
      };
    }

    if (attachments) {
      let attachmentCollection = Array.isArray(attachments) ? attachments : attachments.getCollection();

      // Always require a callback_id for anything with actions, just attach it to all
      for (let attachment of attachmentCollection) {
        attachment.callback_id = character.token;
      }

      options.attachments = JSON.stringify(attachmentCollection);
    }

    return options;
  }

  /**
   * Get the name of the bot used while sending a message.
   *
   * @param {Character} character - The character to send the message to.
   *
   * @return {string}
   */
  _getBotName(character) {
    if (_.isDefined(character.overrideName)) {
      return character.overrideName;
    }

    let name = character.location.getDisplayName(character);

    if (character.state === CHARACTER_STATE.FIGHTING) {
      name += `: Fighting ${character.enemy.getDeterminer(character)}${character.enemy.getLevelName(character)}`;
    }
    else if (character.state === CHARACTER_STATE.ENCOUNTER) {
      name = character.encounter.getBotName(character, name);
    }
    else if (character.state === CHARACTER_STATE.WOUNDED) {
      name = "Phaera, the Great Phoenix";
    }

    return name;
  }

  /**
   * Get the image used for the bot used while sending a message.
   *
   * @param {Character} character - The character to send the message to.
   *
   * @return {string}
   */
  _getBotImage(character) {
    if ( ! _.isUndefined(character.overrideImage)) {
      return character.overrideImage;
    }

    switch (character.state) {
      case CHARACTER_STATE.IDLE:
        return IMG_ROOT + character.location.image;

      case CHARACTER_STATE.ENCOUNTER:
        return IMG_ROOT + character.encounter.getImage(character);

      case CHARACTER_STATE.FIGHTING:
        return IMG_ROOT + 'states/fighting.png';

      case CHARACTER_STATE.WOUNDED:
        return IMG_ROOT + 'characters/phaera.png';
    }
  }
}

module.exports = Slashbot;
