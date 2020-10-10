/*eslint-env mocha */
"use strict";

const CrossroadsEncounter = require('@content/encounters/watermoon/scholar/crossroads');
const Inventory           = require('@app/inventory');
const Character           = require('@app/character').Character;
const Locations           = require('@app/content/locations').Locations;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;
const COLORS          = require('@constants').COLORS;

const ACTION_CHOOSE = 'choose';
const ACTION_CLUE   = 'clue';

const TYPE_CLUE = 'quest-watermoon-clue';

// -- Tests ----------------------------------------------------------------------------------------

describe('Crossroads Encounter', () => {
  describe('getBotName()', () => {
    it('should provide the correct name', () => {
      let character = new Character();

      let encounter = new CrossroadsEncounter();
      expect(encounter.getBotName(character)).toBe("Labyrinth, First Crossroads");

      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 7);
      expect(encounter.getBotName(character)).toBe("Labyrinth Crossroads #7");
    });
  });

  describe('getActions()', () => {
    it('should display the appropriate buttons', () => {
      let character = new Character();
      character.location = Locations.new('watermoon-scholar-hallway-shortcut');
      character.inventory = new Inventory();
      character.setFlag(FLAGS.HALLWAY_CHOICES, [{
        known: true,
        type: "watermoon-scholar-hallway-shortcut"
      }, {
        known: true,
        type: "watermoon-scholar-hallway-detour"
      }, {
        known: false,
        type: "watermoon-scholar-hallway-dark"
      }]);

      let encounter = new CrossroadsEncounter();
      expect(encounter.getActions(character)).toEqual({
        collection: [{
          name: "shortcut_hallway",
          text: "Shortcut Hallway",
          type: "button",
          value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"choose","hallway":0}'
        }, {
          name: "detour_hallway",
          text: "Detour Hallway",
          type: "button",
          value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"choose","hallway":1}'
        }, {
          name: "mysterious_hallway",
          text: "Mysterious Hallway",
          type: "button",
          value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"choose","hallway":2}'
        }, {
          name: "use_a_clue",
          text: "Use a Clue",
          type: "button",
          style: "danger",
          value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"clue"}'
        }, {
          name: "leave",
          text: "Leave",
          type: "button",
          value: 'labyrinth_leave|{}',
          confirm: {
            title: "Are you sure?  This labyrinth is confusing.",
            text: "If you leave now, you won't be able to get back here, to the first hallway.  You'll only be able to find your way back to your last checkpoint, the first crossroads.",
            ok_text: "Leave",
            dismiss_text: "Stay"
          }
        }]
      });
    });
  });

  describe('getHallwayButton()', () => {
    let character, encounter;

    beforeEach(() => {
      character = new Character();
      encounter = new CrossroadsEncounter();
    });

    it('should create a known button', () => {
      const choice = {
        type: "watermoon-scholar-hallway-shortcut",
        known: true
      };

      expect(encounter.getHallwayButton(choice, 0, character)).toEqual({
        name: "shortcut_hallway",
        text: "Shortcut Hallway",
        type: "button",
        value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"choose","hallway":0}'
      });
    });

    it('should create an unknown button', () => {
      const choice = {
        type: "watermoon-scholar-hallway-shortcut",
        known: false
      };

      expect(encounter.getHallwayButton(choice, 0, character)).toEqual({
        name: "mysterious_hallway",
        text: "Mysterious Hallway",
        type: "button",
        value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"choose","hallway":0}'
      });
    });
  });

  describe('getUseClueButton()', () => {
    it('should return a default button when you can use a Clue', () => {
      let character = new Character();
      character.inventory = new Inventory();
      character.inventory.add(TYPE_CLUE, 5);

      let encounter = new CrossroadsEncounter();
      expect(encounter.getUseClueButton(2, character)).toEqual({
        name: "use_a_clue",
        style: "default",
        text: "Use a Clue",
        type: "button",
        value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"clue"}'
      });
    });

    it('should return a danger button when you cannot use a Clue', () => {
      let character = new Character();
      character.inventory = new Inventory();

      // Don't have any clues
      let encounter = new CrossroadsEncounter();
      expect(encounter.getUseClueButton(2, character)).toEqual({
        name: "use_a_clue",
        style: "danger",
        text: "Use a Clue",
        type: "button",
        value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"clue"}'
      });

      // Have clues, but all hallways are known
      character.inventory.add(TYPE_CLUE, 5);
      expect(encounter.getUseClueButton(3, character)).toEqual({
        name: "use_a_clue",
        style: "danger",
        text: "Use a Clue",
        type: "button",
        value: 'encounter|{"type":"watermoon-scholar-crossroads","action":"clue"}'
      });
    });
  });

  describe('getHallwayChoices()', () => {
    it('should return existing hallway choices', () => {
      let character = new Character();
      character.inventory = new Inventory();
      character.setFlag(FLAGS.HALLWAY_CHOICES, 'hallway_choices');

      let encounter = new CrossroadsEncounter();
      expect(encounter.getHallwayChoices(character)).toBe('hallway_choices');
    });

    it('should create new hallway choices', () => {
      let character = new Character();
      let encounter = new CrossroadsEncounter();
      expect(encounter.getHallwayChoices(character)).toEqual([
        { type: expect.any(String), known: false },
        { type: expect.any(String), known: false },
        { type: expect.any(String), known: false },
      ]);
    });
  });

  describe('doAction()', () => {
    it('should choose a hallway', () => {
      let character = new Character();
      let encounter = new CrossroadsEncounter();
      encounter.chooseHallway = jest.fn();
      encounter.info = { hallway: 55 };

      encounter.doAction(ACTION_CHOOSE, character, {}, {});
      expect(encounter.chooseHallway).toHaveBeenCalledWith(55, character);
    });

    it('should use a Clue', () => {
      let character = new Character();
      let encounter = new CrossroadsEncounter();
      encounter.useClue = jest.fn();

      encounter.doAction(ACTION_CLUE, character, {}, {});
      expect(encounter.useClue).toHaveBeenCalledWith(character);
    });

    it('should throw error on invalid type', async () => {
      let encounter = new CrossroadsEncounter();

      await expect(encounter.doAction('asdf', {}, {}, {})).rejects.toHaveProperty(
        'message',
        'Unknown action: asdf.'
      );
    });
  });

  describe('useClue()', () => {
    it('should reveal a mysterious hallway', () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAY_CHOICES, [{
        known: true,
        type: "watermoon-scholar-hallway-a"
      }, {
        known: false,
        type: "watermoon-scholar-hallway-b"
      }, {
        known: false,
        type: "watermoon-scholar-hallway-c"
      }]);
      character.inventory = new Inventory();
      character.inventory.add(TYPE_CLUE, 5);

      let encounter = new CrossroadsEncounter();
      encounter.updateLast = jest.fn();

      encounter.useClue(character);

      expect(character.inventory.quantity(TYPE_CLUE)).toBe(4);
      expect(character.getFlag(FLAGS.HALLWAY_CHOICES)).toEqual([{
        known: true,
        type: "watermoon-scholar-hallway-a"
      }, {
        known: true,
        type: "watermoon-scholar-hallway-b"
      }, {
        known: false,
        type: "watermoon-scholar-hallway-c"
      }]);
      expect(encounter.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "You consult one of your Clues and use it to determine the character of one of the hallways before you.  Its secrets revealed to you, you discard the now-worthless Clue."
          }]
        },
        doLook: true
      });
    });

    it('should produce an error when no clues owned', () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAY_CHOICES, [{
        known: true,
        type: "watermoon-scholar-hallway-a"
      }, {
        known: true,
        type: "watermoon-scholar-hallway-b"
      }, {
        known: true,
        type: "watermoon-scholar-hallway-c"
      }]);
      character.inventory = new Inventory();
      character.inventory.add(TYPE_CLUE, 5);

      let encounter = new CrossroadsEncounter();
      encounter.updateLast = jest.fn();

      encounter.useClue(character);

      expect(encounter.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "There are no more hallways that need identifying.",
            color: COLORS.WARNING
          }]
        },
        doLook: true
      });
    });

    it('should produce an error when no more hallways to reveal', () => {
      let character = new Character();
      character.inventory = new Inventory();
      let encounter = new CrossroadsEncounter();
      encounter.updateLast = jest.fn();

      encounter.useClue(character);

      expect(encounter.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "You don't have any clues to use.",
            color: COLORS.WARNING
          }]
        },
        doLook: true
      });
    });
  });

  describe('chooseHallway()', () => {
    it('should move a character into the chosen hallway', () => {
      let character = new Character();
      character.inventory = new Inventory();
      character.setFlag(FLAGS.HALLWAY_CHOICES, [{
        known: true,
        type: "watermoon-scholar-hallway-shortcut"
      }]);

      let encounter = new CrossroadsEncounter();
      encounter.updateLast = jest.fn();

      encounter.chooseHallway(0, character);

      expect(character.state).toBe(CHARACTER_STATE.IDLE);
      expect(character.location.type).toBe("watermoon-scholar-hallway-shortcut");
      expect(character.getFlag(FLAGS.HALLWAY_REMAINING)).toBe(5);
      expect(character.hasFlag(FLAGS.HALLWAY_CHOICES)).toBe(false);

      expect(encounter.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "You set out down the Shortcut Hallway."
          }]
        },
        doLook: true
      });
    });
  });
});