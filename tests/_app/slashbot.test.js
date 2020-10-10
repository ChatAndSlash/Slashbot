/*eslint-env mocha */
"use strict";

const MockDate    = require('mockdate');
const Log         = require('@util/log');
const Slashbot    = require('@app/slashbot');
const Commands    = require('@app/content/commands').Commands;
const Character   = require('@app/character').Character;
const Inventory   = require('@app/inventory');
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const IMG_ROOT        = require('@constants').IMG_ROOT;
const FLAGS           = require('@constants').FLAGS;
const STATS           = require('@constants').STATS;

// -- Set up fixtures ------------------------------------------------------------------------------

const character = {
  uid: 'user_id',
  channel: 'testChannel',
  teamid: 'testTeam',
  location: {
    displayName: 'Town',
    type: 'town',
    image: 'locations/city.png',
    getDisplayName: () => 'Town',
  },
  token: 'token',
  queueSuffix: 'suffix',
};
const idleCharacter = _.extend({}, character, {
  state: CHARACTER_STATE.IDLE,
});
const fightingCharacter = _.extend({}, character, {
  state: CHARACTER_STATE.FIGHTING,
  enemy: {
    level: 5,
    type: 'goblin',
    isAre: 'is',
    getDisplayName: (character) => 'Goblin',
    getLevelName: () => 'L5 Goblin',
    getDeterminer: () => 'a ',
  },
});
const encounterCharacter = _.extend({}, character, {
  state: CHARACTER_STATE.ENCOUNTER,
  encounter: {
    getBotName: () => "Town: Encounter Name",
    getImage: () => "encounter.png"
  }
});
const woundedCharacter = _.extend({}, character, {
  state: CHARACTER_STATE.WOUNDED
});

const attachment = Attachments.one({ title: 'The title.' });

// -- Tests ----------------------------------------------------------------------------------------

describe('Slashbot', () => {
  let slashbot;

  beforeEach(() => {
    slashbot = new Slashbot({});
    Log.error = jest.fn();
    Log.info  = jest.fn();
  });

  describe('connect()', () => {
    it('should create channel and monitor queue', async () => {

      const channel = {
        assertQueue: jest.fn(),
        consume: jest.fn()
      };

      const connection = {
        createChannel: jest.fn(() => channel)
      };

      slashbot.amqp.connect = jest.fn(() => connection);

      await slashbot.connect();

      expect(slashbot.mqConnection).toBe(connection);
      expect(connection.createChannel).toHaveBeenCalled();
      expect(channel.assertQueue).toHaveBeenCalledWith('in_queue-test');
      expect(channel.consume).toHaveBeenCalledWith('in_queue-test', expect.any(Function), { noAck: true });
    });
  });

  describe('onConsume()', () => {
    it('should log errors', () => {
      slashbot.onConsume('not json');

      expect(Log.error).toHaveBeenCalledTimes(2);
    });

    it ('should dequeue a good message', () => {
      slashbot.dequeue = jest.fn();

      slashbot.onConsume({
        content: "{ \"boop\": \"yeah\" }",
        fields: {
          routingKey: 'in_queue-test'
        }
      });

      expect(slashbot.dequeue).toHaveBeenCalledWith({ boop: "yeah" }, 'test');
    });
  });

  describe('tellStory()', () => {
    it('should tell the story', () => {

      const slashbot = new Slashbot("");
      slashbot.say = jest.fn();

      const character = { channel: "channel", token: "token", slashbot };

      slashbot.tellStory([
        { npc: 'obsidia', text: "first" },
        { text: "second" },
        "third",
        { text: "final", buttonText: "buttonText", color: "color" },
      ], character);

      expect(slashbot.say).toHaveBeenCalledWith(
        "first", {
          "channel": "channel",
          "overrideImage": "https://s3.amazonaws.com/chatandslash/img/characters/obsidia.png",
          "overrideName": "Obsidia",
          "token": "token"
        }, {
          "messageDelay": 0,
          "typing": true
        }
      );

      expect(slashbot.say).toHaveBeenCalledWith(
        "second", {
          "channel": "channel",
          "overrideImage": "https://s3.amazonaws.com/chatandslash/img/characters/narrator.png",
          "overrideName": "Narrator",
          "token": "token"
        }, {
          "messageDelay": 5,
          "typing": true
        }
      );

      expect(slashbot.say).toHaveBeenCalledWith(
        "third", {
          "channel": "channel",
          "overrideImage": "https://s3.amazonaws.com/chatandslash/img/characters/narrator.png",
          "overrideName": "Narrator",
          "token": "token"
        }, {
          "messageDelay": 10,
          "typing": true
        }
      );

      expect(slashbot.say).toHaveBeenCalledWith(
        "final",  {
          "channel": "channel",
          "overrideImage": "https://s3.amazonaws.com/chatandslash/img/characters/narrator.png",
          "overrideName": "Narrator",
          "token": "token"
        }, {
          "attachments": {
            "collection": [
              {
                "actions": [
                  {"name": "button_text", "text": "buttonText", "type": "button", "value": "continue|{}"}
                ],
                "attachment_type": "default",
                "color": "color",
                "title": " "
              }
            ]
          },
          "messageDelay": 20
        }
      );
    });
  });

  describe('_getBotName()', () => {
    it('should describe a character correctly', () => {
      expect(slashbot._getBotName(idleCharacter)).toBe("Town");
      expect(slashbot._getBotName(fightingCharacter)).toBe("Town: Fighting a L5 Goblin");
      expect(slashbot._getBotName(encounterCharacter)).toBe("Town: Encounter Name");
      expect(slashbot._getBotName(woundedCharacter)).toBe("Phaera, the Great Phoenix");
    });

    it('should return an overriden name', () => {
      expect(slashbot._getBotName({ overrideName: 'overit' })).toBe('overit');
    });
  });

  describe('_getBotImage()', () => {
    it('should provide the correct images for characters', () => {
      expect(slashbot._getBotImage(idleCharacter)).toBe(IMG_ROOT + 'locations/city.png');
      expect(slashbot._getBotImage(fightingCharacter)).toBe(IMG_ROOT + 'states/fighting.png');
      expect(slashbot._getBotImage(encounterCharacter)).toBe(IMG_ROOT + 'encounter.png');
      expect(slashbot._getBotImage(woundedCharacter)).toBe(IMG_ROOT + 'characters/phaera.png');
    });

    it('should return an overriden image', () => {
      expect(slashbot._getBotImage({ overrideImage: 'overit' })).toBe('overit');
    });
  });

  describe('_getMessageOptions()', () => {
    it('should composite the correct options', () => {
      expect(slashbot._getMessageOptions(idleCharacter, attachment)).toEqual({
        username: 'Town',
        icon_url: 'https://s3.amazonaws.com/chatandslash/img/locations/city.png',
        attachments: '[{"title":"The title.","callback_id":"token"}]'
      });
    });
  });

  describe('enqueue()', () => {
    it('should enqueue a message', async () => {
      slashbot.channel = {
        publish: jest.fn(),
      };
      const msg = { prop: 'val' };

      slashbot.enqueue(msg, 'test');
      expect(slashbot.channel.publish).toHaveBeenCalledWith(
        'out_exchange-test',
        'out_queue-test',
        Buffer.from(JSON.stringify(msg)),
        { headers: { "x-delay": 0 } },
      );
    });
  });

  describe('dequeue()', () => {
    it('should dequeue a button message', () => {
      slashbot.onButton = jest.fn();
      slashbot.dequeue({ type: 'button', payload: 'buttonPayload' }, 'suffix');
      expect(slashbot.onButton).toHaveBeenCalledWith('buttonPayload', 'suffix');
    });

    it('should dequeue a slash message', () => {
      slashbot.onSlash = jest.fn();
      slashbot.dequeue({ type: 'slash', payload: 'slashPayload' }, 'suffix');
      expect(slashbot.onSlash).toHaveBeenCalledWith('slashPayload', 'suffix');
    });

    it('should dequeue a newgame message', () => {
      slashbot.onNewGame = jest.fn();
      slashbot.dequeue({ type: 'new-game', payload: 'newGamePayload' }, 'suffix');
      expect(slashbot.onNewGame).toHaveBeenCalledWith('newGamePayload', 'suffix');
    });

    it('should dequeue a payment message', () => {
      slashbot.onPayment = jest.fn();
      slashbot.dequeue({ type: 'payment', payload: 'paymentPayload' }, 'suffix');
      expect(slashbot.onPayment).toHaveBeenCalledWith('paymentPayload', 'suffix');
    });

    it('should error out on unrecognized messages', () => {
      slashbot.dequeue({ type: 'unknown' });
      expect(Log.error).toHaveBeenCalledWith({ type: 'unknown' }, "Could not identify message type.");
    });
  });

  describe('say()', () => {
    it('should enqueue a say message', () => {
      MockDate.set(1000);
      slashbot.enqueue = jest.fn();

      slashbot.say('text', idleCharacter);

      expect(slashbot.enqueue).toHaveBeenCalledWith({
        type: 'say',
        channel: 'testChannel',
        team: 'testTeam',
        uid: 'user_id',
        text: 'text',
        opts: { "icon_url": IMG_ROOT + "locations/city.png", "username": "Town" },
        typing: false
      }, 'suffix', 0);
    });
  });

  describe('dm()', () => {
    it('should enqueue a dm message', () => {
      MockDate.set(1000);
      slashbot.enqueue = jest.fn();

      slashbot.dm('text', idleCharacter, { messageDelay: 1 });

      expect(slashbot.enqueue).toHaveBeenCalledWith({
        type: 'dm',
        uid: 'user_id',
        team: 'testTeam',
        channel: 'dm',
        text: 'text',
        opts: { "icon_url": IMG_ROOT + "locations/city.png", "username": "Town" },
      }, 'suffix', 1000);
    });
  });

  describe('update()', () => {
    it('should enqueue an update message', () => {
      MockDate.set(1000);
      slashbot.enqueue = jest.fn();

      slashbot.update({ ts: 'ts', bot_id: 'bot_id' }, 'text', idleCharacter );

      expect(slashbot.enqueue).toHaveBeenCalledWith({
        type: 'update',
        ts: 'ts',
        channel: 'testChannel',
        team: 'testTeam',
        uid: 'user_id',
        text: 'text',
        opts: { "icon_url": IMG_ROOT + "locations/city.png", "username": "Town" }
      }, 'suffix');
    });
  });

  describe('sayError()', () => {
    it('should log the error and say appropriate message', () => {
      slashbot.say = jest.fn();

      const errorCharacter = {
        plain: true,
        channel: 'channel'
      };

      slashbot.sayError({ message: 'err' }, 'channel');
      expect(slashbot.say).toHaveBeenCalledWith(__('Hm, that request... confused me.  Wait a moment, then try again.'), errorCharacter);
    });
  });

  describe('getNpc()', () => {
    it('should get phaera', () => {
      expect(slashbot.getNpc('phaera', idleCharacter)).toEqual({
        channel: idleCharacter.channel,
        teamid: 'testTeam',
        token: 'token',
        queueSuffix: 'suffix',
        overrideName: 'Phaera, the Great Phoenix',
        overrideImage: IMG_ROOT + 'characters/phaera.png',
        uid: 'user_id',
      });
    });

    it('should get the narrator', () => {
      expect(slashbot.getNpc('narrator', idleCharacter)).toEqual({
        channel: idleCharacter.channel,
        teamid: 'testTeam',
        token: 'token',
        queueSuffix: 'suffix',
        overrideName: 'Narrator',
        overrideImage: IMG_ROOT + 'characters/narrator.png',
        uid: 'user_id',
      });
    });

    it('should get the winged woman', () => {
      expect(slashbot.getNpc('winged_woman', idleCharacter)).toEqual({
        channel: idleCharacter.channel,
        teamid: 'testTeam',
        token: 'token',
        queueSuffix: 'suffix',
        overrideName: 'Winged Woman',
        overrideImage: IMG_ROOT + 'characters/phaera.png',
        uid: 'user_id',
      });
    });

    it('should get obsidia', () => {
      expect(slashbot.getNpc('obsidia', idleCharacter)).toEqual({
        channel: idleCharacter.channel,
        teamid: 'testTeam',
        token: 'token',
        queueSuffix: 'suffix',
        overrideName: 'Obsidia',
        overrideImage: IMG_ROOT + 'characters/obsidia.png',
        uid: 'user_id',
      });
    });

    it('should get aureth', () => {
      expect(slashbot.getNpc('aureth', idleCharacter)).toEqual({
        channel: idleCharacter.channel,
        teamid: 'testTeam',
        token: 'token',
        queueSuffix: 'suffix',
        overrideName: 'Aureth',
        overrideImage: IMG_ROOT + 'characters/aureth.png',
        uid: 'user_id',
      });
    });

    it('should get present', () => {
      expect(slashbot.getNpc('present', idleCharacter)).toEqual({
        channel: idleCharacter.channel,
        teamid: 'testTeam',
        token: 'token',
        queueSuffix: 'suffix',
        overrideName: 'A Present!',
        overrideImage: IMG_ROOT + 'characters/present.png',
        uid: 'user_id',
      });
    });

    it('should throw an error on invalid NPC', () => {
      expect(() => {
        slashbot.getNpc('blerp', idleCharacter);
      }).toThrowError("Unknown NPC: 'blerp'");
    });
  });

  describe('parseButtonPayload()', () => {
    it('should error out on invalid JSON', () => {
      expect(() => {
        slashbot.parseButtonPayload({
          channel: { id: 'id' },
          actions: [{
            value: 'command|badjson'
          }]
        });
      }).toThrowError(SyntaxError);
    });

    it('should spit out correct information for buttons', () => {
      expect(slashbot.parseButtonPayload({
        actions: [{
          name: 'city_of_tyrose',
          type: 'button',
          value: 'travel|{"to":"tyrose"}'
        }],
        user: { id: 'U0VL1JXS9' },
        team: { id: 'T0VL1JXS9' },
        message_ts: '1502034443.577090',
      })).toEqual([
        'travel',
        { message_ts: "1502034443.577090", to: "tyrose" },
        { command: "travel", info: { to: "tyrose" }, uid: "U0VL1JXS9", teamid: "T0VL1JXS9" }
      ]);
    });

    it('should spit out correct information for selects', () => {
      expect(slashbot.parseButtonPayload({
        actions: [{
          name: 'equipment',
          type: 'select',
          selected_options: [{
            value: 'buy|{"action":"confirm","item":"equipment-weapons-002_ash_club"}'
          }]
        }],
        user: { id: 'U0VL1JXS9' },
        team: { id: 'T0VL1JXS9' },
        message_ts: '1502034443.577090',
      })).toEqual([
        'buy',
        { action: "confirm", message_ts: "1502034443.577090", item: "equipment-weapons-002_ash_club" },
        { command: "buy", info: { action: "confirm", item: "equipment-weapons-002_ash_club" }, uid: "U0VL1JXS9", teamid: "T0VL1JXS9" }
      ]);
    });
  });

  describe('isCorrectChannel', () => {
    it('should parse button payloads correctly', () => {
      let slashbot = new Slashbot();
      let character = new Character();
      character.setValues({ uid: 'good_uid' });

      expect(slashbot.isCorrectChannel(
        character,
        { channel: '', user: { id: 'bad_uid' } }
      )).toBe(false);

      expect(slashbot.isCorrectChannel(
        character,
        { channel: '', user: { id: 'good_uid' } }
      )).toBe(true);
    });

    it('should parse slash commands correctly', () => {
      let slashbot = new Slashbot();
      let character = new Character();
      character.setValues({ uid: 'good_uid' });

      expect(slashbot.isCorrectChannel(
        character,
        { channel_id: '', user_id: 'bad_uid' }
      )).toBe(false);

      expect(slashbot.isCorrectChannel(
        character,
        { channel_id: '', user_id: 'good_uid' }
      )).toBe(true);
    });
  });

  describe('isCurrentButton()', () => {
    it('should identify current buttons', () => {
      let character = new Character();
      character.setValues({ token: 'good_token' });

      expect(slashbot.isCurrentButton(character, 'good_token')).toBe(true);
      expect(slashbot.isCurrentButton(character, 'bad_token')).toBe(false);
    });
  });

  describe('isInCutscene()', () => {
    it('should identify if character is in cutscene', () => {
      let character = new Character();
      character.setValues();
      expect(slashbot.isInCutscene(character)).toBe(false);

      character.setFlag(FLAGS.IN_CUTSCENE);
      expect(slashbot.isInCutscene(character)).toBe(true);
    });
  });

  describe('warnOnOldButton()', () => {
    it('should issue the correct warning', () => {
      let character = new Character();
      character.setValues();
      let slashbot = new Slashbot();
      slashbot.update = jest.fn();
      let message = { text: 'text' };

      slashbot.warnOnOldButton(character, message);

      expect(slashbot.update).toHaveBeenCalledWith(
        message,
        message.text,
        character,
        {
          "collection": [{
            "title": ":warning: You clicked an old button.  To keep things simple, please only click the newest ones.  Need new buttons?  Type '/look'."
          }]
        }
      );
    });
  });

  describe('onButton()', () => {
    let slashbot;

    beforeEach(() => {
      slashbot = new Slashbot();
      slashbot.reportError = jest.fn();
      slashbot.sayError = jest.fn();
    });

    it('should error out when an invalid payload is provided', async () => {
      const payload = {
        channel: { id: 'channel_id' },
        team: { id: 'team_id' },
        actions: [{
          value: 'command|badjson'
        }]
      };

      await slashbot.onButton(payload, 'suffix');

      expect(slashbot.reportError).toHaveBeenCalledWith(
        expect.any(SyntaxError),
        expect.any(Object),
        'unknown command',
        payload
      );
      expect(slashbot.sayError).toHaveBeenCalledWith(
        expect.any(SyntaxError),
        'channel_id',
        'team_id',
        'suffix'
      );
    });

    it('should do nothing if incorrect channel', async () => {
      const payload = {
        channel: { id: 'channel_id' },
        user: { id: 'uid' },
        team: { id: 'teamid' },
        actions: [{
          value: 'command'
        }]
      };

      let character = new Character();
      character.setValues();

      slashbot.getLoadedCharacter = jest.fn(() => character);
      slashbot.isCorrectChannel = jest.fn(() => false);
      slashbot.doCommand = jest.fn();

      await slashbot.onButton(payload);

      expect(slashbot.doCommand).not.toHaveBeenCalled();
    });

    it('should update old button and /look if old button pressed', async () => {
      const payload = {
        channel: { id: 'channel_id' },
        user: { id: 'uid' },
        team: { id: 'tid' },
        actions: [{
          value: 'command'
        }],
        original_message: { text: 'original_message' },
        trigger_id: 'trigger_id',
      };

      let character = new Character();
      character.setValues();
      character.save = jest.fn();

      slashbot.getLoadedCharacter = jest.fn(() => character);
      slashbot.isCorrectChannel = jest.fn(() => true);
      slashbot.isCurrentButton = jest.fn(() => false);
      slashbot.isInCutscene = jest.fn(() => false);
      slashbot.warnOnOldButton = jest.fn();
      slashbot.doCommand = jest.fn();

      await slashbot.onButton(payload);

      expect(slashbot.warnOnOldButton).toHaveBeenCalledWith(
        character,
        payload.original_message
      );
      expect(slashbot.doCommand).toHaveBeenCalledWith(
        'look',
        character,
        {
          info: {},
          message: {
            ...payload.original_message,
            channel_id: payload.channel.id,
          },
          triggerId: payload.trigger_id
        }
      );
      expect(character.save).toHaveBeenCalled();
    });

    it('should do expected command', async () => {
      const payload = {
        channel: { id: 'channel_id' },
        user: { id: 'uid' },
        team: { id: 'tid' },
        actions: [{
          value: 'command'
        }],
        original_message: { text: 'original_message' },
        trigger_id: 'trigger_id',
      };

      let character = new Character();
      character.setValues();
      character.save = jest.fn();

      slashbot.getLoadedCharacter = jest.fn(() => character);
      slashbot.isCorrectChannel = jest.fn(() => true);
      slashbot.isCurrentButton = jest.fn(() => true);
      slashbot.doCommand = jest.fn();

      await slashbot.onButton(payload);

      expect(slashbot.doCommand).toHaveBeenCalledWith(
        'command',
        character,
        {
          info: {
            message_ts: undefined
          },
          message: {
            ...payload.original_message,
            channel_id: payload.channel.id,
          },
          triggerId: payload.trigger_id,
        }
      );
      expect(character.save).toHaveBeenCalled();
    });
  });

  describe('onSlash()', () => {
    let slashbot;

    beforeEach(() => {
      slashbot = new Slashbot();
      slashbot.reportError = jest.fn();
      slashbot.sayError = jest.fn();
    });

    it('should do nothing if in incorrect channel', async () => {
      const payload = {
        channel_id: 'G2H99MWJE',
        user_id: 'U0VL1JXS9',
        command: '/look',
        text: '',
      };

      let character = new Character();
      character.setValues();

      slashbot.getLoadedCharacter = jest.fn(() => character);
      slashbot.isCorrectChannel = jest.fn(() => false);
      slashbot.doCommand = jest.fn();

      await slashbot.onSlash(payload);

      expect(slashbot.doCommand).not.toHaveBeenCalled();
    });

    it('should do nothing if in cutscene', async () => {
      const payload = {
        channel_id: 'G2H99MWJE',
        user_id: 'U0VL1JXS9',
        command: '/character',
        text: '',
      };

      let character = new Character();
      character.setValues();

      slashbot.getLoadedCharacter = jest.fn(() => character);
      slashbot.isCorrectChannel = jest.fn(() => true);
      slashbot.isInCutscene = jest.fn(() => true);
      slashbot.doCommand = jest.fn();

      await slashbot.onSlash(payload);

      expect(slashbot.doCommand).not.toHaveBeenCalled();
    });

    it('should do expected command', async () => {
      const payload = {
        channel_id: 'G2H99MWJE',
        user_id: 'U0VL1JXS9',
        command: '/look',
        text: '',
      };

      let character = new Character();
      character.setValues();
      character.save = jest.fn();

      slashbot.getLoadedCharacter = jest.fn(() => character);
      slashbot.isCorrectChannel = jest.fn(() => true);
      slashbot.isInCutscene = jest.fn(() => false);
      slashbot.doCommand = jest.fn();

      await slashbot.onSlash(payload);

      expect(slashbot.doCommand).toHaveBeenCalledWith('look', character, { info: { text: payload.text } });
      expect(character.save).toHaveBeenCalled();
    });

    it('should not save when twinking', async () => {
      const payload = {
        channel_id: 'G2H99MWJE',
        user_id: 'U0VL1JXS9',
        command: '/dtwink',
        text: '',
      };

      let character = new Character();
      character.setValues();
      character.save = jest.fn();

      slashbot.getLoadedCharacter = jest.fn(() => character);
      slashbot.isCorrectChannel = jest.fn(() => true);
      slashbot.isInCutscene = jest.fn(() => false);
      slashbot.doCommand = jest.fn();

      await slashbot.onSlash(payload);

      expect(slashbot.doCommand).toHaveBeenCalledWith('dtwink', character, { info: { text: payload.text } });
      expect(character.save).not.toHaveBeenCalled();
    });
  });

  describe('onNewGame()', () => {
    it('should create a character & tell the story', async () => {
      slashbot.createCharacter = jest.fn(() => {
        return { slashbot };
      });
      slashbot.say = jest.fn();

      await slashbot.onNewGame({ uid: 'uid', name: 'name', channel: 'channel', suffix: 'suffix' });

      // It's not important what the story is, just that it happens.
      expect(slashbot.say).toHaveBeenCalled();
    });
  });

  describe('onPayment()', () => {
    it('should error out on bogus payment data', async () => {
      const payload = {
        id: 'hashid',
        price: 22,
        items: { scales: 10 },
      };

      let slashbot = new Slashbot();

      await expect(slashbot.onPayment(payload)).rejects.toHaveProperty(
        'message',
        "Cannot decode hashid: 'hashid'."
      );
    });

    it('should award payment items to a character', async () => {
      const payload = {
        id: 'aE7K',
        price: 22,
        items: { scales: 10 },
      };

      let character = new Character();
      character.setValues({
        uid: 'uid',
        channel: 'channel',
        teamid: 'teamid',
        token: 'token',
        scales: 5
      });
      character.increaseStat = jest.fn();
      character.save = jest.fn();

      let slashbot = new Slashbot();
      slashbot.say = jest.fn();
      slashbot.dm = jest.fn();
      slashbot.getLoadedCharacter = jest.fn(() => character);

      const presentNpc = {
        channel: 'channel',
        teamid: 'teamid',
        overrideImage: "https://s3.amazonaws.com/chatandslash/img/characters/present.png",
        overrideName: 'A Present!',
        token: 'token',
        uid: 'uid'
      };

      await slashbot.onPayment(payload);

      expect(character.scales).toBe(15);
      expect(character.increaseStat).toHaveBeenCalledWith(STATS.SCALES_PURCHASED, 10);
      expect(character.increaseStat).toHaveBeenCalledWith(STATS.MONEY_SPENT, 22);

      expect(slashbot.say).toHaveBeenCalledWith(
        "With a burst of flame, a small box appears in front of you.  Curious, you pick it up and open it.  Inside, glittering brightly, are 10 Dragon Scales.  You tuck your treasure away, silently thanking your ethereal benefactor.",
        presentNpc
      );
      expect(slashbot.dm).toHaveBeenCalledWith(
        "Your purchase was successful, and your 10 Dragon Scales have been added to your character!",
        presentNpc
      );

      expect(character.save).toHaveBeenCalled();
    });
  });

  describe('doCommand()', () => {
    it('should create and execute Commands that exist', async () => {
      const Command = {
        execute: jest.fn()
      };
      Commands.new = jest.fn(() => Command);

      let character = new Character();
      character.inventory = new Inventory();
      await slashbot.doCommand('command', character);

      expect(Command.execute).toHaveBeenCalledTimes(1);
    });
  });
});