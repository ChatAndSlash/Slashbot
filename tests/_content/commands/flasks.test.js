/*eslint-env mocha */
"use strict";

const FlasksCommand = require('@content/commands/flasks');
const Character     = require('@app/character').Character;
const Inventory     = require('@app/inventory');
const Location      = require('@app/content/locations').Location;

const STATS = require('@constants').STATS;

describe('FlasksCommand', () => {
  let character;
  let command;

  beforeEach(() => {
    character = (new Character()).setValues();
    character.inventory = new Inventory();
    character.location  = new Location({
      flasks: [
        'force',
        'technique',
        'defence',
      ],
      flaskText: __("Stronger?"),
    });

    command = new FlasksCommand(character, {}, {}, {});
  });

  describe('execute()', () => {
    it('should show or drink a flask', async () => {
      command.showFlasks = jest.fn();
      await command.execute();
      expect(command.showFlasks).toHaveBeenCalled();

      command.drinkFlask = jest.fn();
      command.info.action = "drink";
      await command.execute();
      expect(command.drinkFlask).toHaveBeenCalled();
    });
  });

  describe('showFlasks()', () => {
    it('should show all the flasks to be purchased', async () => {
      command.updateLast = jest.fn();

      await command.execute();

      expect(command.updateLast).toHaveBeenCalledWith({
        description: expect.any(String),
        attachments: expect.any(Object)
      });
    });
  });

  describe('getFlaskDescriptions()', () => {
    it('should get correct flask descriptions', () => {
      expect(command.getFlaskDescriptions(character)).toBe("\n>- *+1 Force:* 1x Crystal Acid\n>- *+1 Technique:* 1x Crystal Acid\n>- *+1 Defence:* 1x Crystal Acid");
    });
  });

  describe('getCatalystsOwnedText()', () => {
    it('should show the list of relevant catalysts owned', () => {
      expect(command.getCatalystsOwnedText(character)).toBe("\n\nYou have *0x Crystal Acid* to spend.");
    });
  });

  describe('getFlaskButtons()', () => {
    it('should get the correct flask buttons', () => {
      expect(command.getFlaskButtons(character)).toEqual({
        collection: [
          {
            name: "force",
            style: "danger",
            text: "Force",
            type: "button",
            value: 'flasks|{"action":"drink","flaskType":"force"}'
          }, {
            name: "technique",
            style: "danger",
            text: "Technique",
            type: "button",
            value: 'flasks|{"action":"drink","flaskType":"technique"}'
          }, {
            name: "defence",
            style: "danger",
            text: "Defence",
            type: "button",
            value: 'flasks|{"action":"drink","flaskType":"defence"}'
          }, {
            name: "cancel",
            text: "Cancel",
            type: "button",
            value: 'look|{"resetDescription":"true"}'
          }
        ]
      });
    });
  });

  describe('getCostDescription()', () => {
    it('should return a valid cost description', () => {
      expect(command.getCostDescription(character, 'force')).toBe("1x Crystal Acid");

      character.increaseStat(STATS.FLASK_PURCHASED, 1, 'minDamage');
      expect(command.getCostDescription(character, 'minDamage')).toBe("2x Moondrops");
    });
  });

  describe('getCost()', () => {
    it('should return the correct costs', () => {
      expect(command.getCost(character, 'force')).toBe(1);

      character.setStat(STATS.FLASK_PURCHASED, 1, 'force');
      expect(command.getCost(character, 'force')).toBe(2);

      character.setStat(STATS.FLASK_PURCHASED, 4, 'force');
      expect(command.getCost(character, 'force')).toBe(5);

      character.setStat(STATS.FLASK_PURCHASED, 5, 'force');
      expect(command.getCost(character, 'force')).toBe(9);

      character.setStat(STATS.FLASK_PURCHASED, 9, 'force');
      expect(command.getCost(character, 'force')).toBe(49);

      character.setStat(STATS.FLASK_PURCHASED, 14, 'force');
      expect(command.getCost(character, 'force')).toBe(144);
    });
  });

  describe('getFlaskCatalyst()', () => {
    it('should pick the correct catalyst', () => {
      expect(command.getFlaskCatalyst('force').type).toBe('catalyst-crystal_acid');
      expect(command.getFlaskCatalyst('technique').type).toBe('catalyst-crystal_acid');
      expect(command.getFlaskCatalyst('defence').type).toBe('catalyst-crystal_acid');
      expect(command.getFlaskCatalyst('maxHp').type).toBe('catalyst-quicksalt');
      expect(command.getFlaskCatalyst('maxMp').type).toBe('catalyst-quicksalt');
      expect(command.getFlaskCatalyst('minDamage').type).toBe('catalyst-moondrop');
      expect(command.getFlaskCatalyst('maxDamage').type).toBe('catalyst-moondrop');
      expect(command.getFlaskCatalyst('spellPower').type).toBe('catalyst-moondrop');

      expect(() => {
        command.getFlaskCatalyst('dooper');
      }).toThrow();
    });
  });

  describe('drinkFlask()', () => {
    it('should display an error when character doesn\'t have the required catalysts', async () => {
      command.info.flaskType = 'force';
      command.updateLast = jest.fn();

      await command.drinkFlask();

      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "You don't have enough Crystal Acid to buy that."
          }]
        },
        doLook: true
      });
    });

    it('should increase character stats when drunk', async () => {
      command.info.flaskType = 'force';
      command.increaseStat = jest.fn();
      command.updateLast = jest.fn();
      command.character.inventory.add('catalyst-crystal_acid', 2);

      await command.drinkFlask();

      expect(character.inventory.quantity('catalyst-crystal_acid')).toBe(1);
      expect(command.increaseStat).toHaveBeenCalledWith(character, 'force');
      expect(character.getStat(STATS.FLASK_PURCHASED, 'force')).toBe(1);
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: ":wine_glass: You give the tavernkeeper 1 Crystal Acid and he hands you a softly-glowing flask.  After brief hesitation, you toss it back and feel it course through you.  You gain 1 force!"
          }]
        },
        doLook: true
      });
    });
  });

  describe('getIncreaseText()', () => {
    it('should generate the correct increase text', () => {
      expect(command.getIncreaseText(1, 'force')).toBe("1 force");
      expect(command.getIncreaseText(0.05, 'minDamage')).toBe("5% min. damage");
    });
  });

  describe('getStatIncrease()', () => {
    it('should get the correct stat increases', () => {
      expect(command.getStatIncrease(character, 'force')).toBe(1);
      expect(command.getStatIncrease(character, 'technique')).toBe(1);
      expect(command.getStatIncrease(character, 'defence')).toBe(1);
      expect(command.getStatIncrease(character, 'minDamage')).toBe(0.05);
      expect(command.getStatIncrease(character, 'maxDamage')).toBe(0.05);
      expect(command.getStatIncrease(character, 'maxHp')).toBe(10);
      expect(command.getStatIncrease(character, 'maxMp')).toBe(5);
      expect(command.getStatIncrease(character, 'spellPower')).toBe(1);
    });
  });

  describe('increaseStat()', () => {
    it('should correctly increase a character\'s stats', () => {
      character.setValues({
        force: 1,
        technique: 2,
        defence: 3,
        max_hp: 100,
        max_mp: 50,
        spell_power: 10
      });

      command.increaseStat(character, 'force');
      expect(character.force).toBe(2);

      command.increaseStat(character, 'technique');
      expect(character.technique).toBe(3);

      command.increaseStat(character, 'defence');
      expect(character.defence).toBe(4);

      command.increaseStat(character, 'maxHp');
      expect(character.maxHp).toBe(110);

      command.increaseStat(character, 'maxMp');
      expect(character.maxMp).toBe(55);

      command.increaseStat(character, 'spellPower');
      expect(character.spellPower).toBe(11);
    });
  });
});