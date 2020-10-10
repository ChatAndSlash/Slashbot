/*eslint-env mocha */
"use strict";

const Combat     = require('@app/combat');
const Character  = require('@app/character').Character;
const Enemy      = require('@app/content/enemies').Enemy;
const Profession = require('@app/content/professions').Profession;
const Weapon     = require("@app/content/items/equipment/weapons");

const FIGHT_ACTIONS = require('@constants').FIGHT_ACTIONS;
const FLAGS         = require('@constants').FLAGS;

describe('Combat', () => {
  describe('getActions()', () => {
    afterEach(() => {
      jest.resetModules();
    });

    it('should display the Do Nothing button when stunned', () => {
      const character = new Character();
      character.enemy = new Enemy();
      character.profession = new Profession();
      character.setFlag(FLAGS.STUNNED_TURNS);
      jest.spyOn(Combat, 'getDoNothingButton');

      Combat.getActions(character);

      expect(Combat.getDoNothingButton).toHaveBeenCalledWith(character);

      Combat.getDoNothingButton.mockRestore();
    });

    it('should display the Frenzy button when frenzied', () => {
      const character = new Character();
      character.enemy = new Enemy();
      character.profession = new Profession();
      character.setFlag(FLAGS.FRENZY_TURNS);
      jest.spyOn(Combat, 'getFrenzyButton');

      Combat.getActions(character);

      expect(Combat.getFrenzyButton).toHaveBeenCalledWith(character);

      Combat.getFrenzyButton.mockRestore();
    });

    it('should display the standard buttons otherwise', () => {
      const character = new Character();
      character.enemy = new Enemy();
      character.weapon = new Weapon();
      character.profession = new Profession();
      character.knownSpells = [];

      jest.spyOn(Combat, 'getAttackButton');
      jest.spyOn(Combat, 'getDefendButton');
      jest.spyOn(Combat, 'getCastButton');
      jest.spyOn(Combat, 'getItemButton');
      jest.spyOn(Combat, 'getRunButton');

      Combat.getActions(character);

      expect(Combat.getAttackButton).toHaveBeenCalledWith(character);
      expect(Combat.getDefendButton).toHaveBeenCalledWith(character);
      expect(Combat.getCastButton).toHaveBeenCalledWith(character);
      expect(Combat.getItemButton).toHaveBeenCalledWith(character);
      expect(Combat.getRunButton).toHaveBeenCalledWith(character);

      Combat.getAttackButton.mockRestore();
      Combat.getDefendButton.mockRestore();
      Combat.getCastButton.mockRestore();
      Combat.getItemButton.mockRestore();
      Combat.getRunButton.mockRestore();
    });
  });

  describe('getDoNothingButton()', () => {
    it('should return a button to do nothing', () => {
      expect(Combat.getDoNothingButton({})).toEqual({
        name: "do_nothing",
        text: "Do Nothing",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.DO_NOTHING}"}`
      });
    });
  });

  describe('getFrenzyButton()', () => {
    it('should display correct button text', () => {
      let character = new Character();

      character.setFlag(FLAGS.FRENZY_TURNS, 1);
      expect(Combat.getFrenzyButton(character)).toEqual({
        name: "attack",
        text: "ATTACK!!!",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.ATTACK}"}`
      });

      character.setFlag(FLAGS.FRENZY_TURNS, 2);
      expect(Combat.getFrenzyButton(character)).toEqual({
        name: "attack",
        text: "Attack!",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.ATTACK}"}`
      });
    });
  });

  describe('getAttackButton()', () => {
    it('should display jammed button', () => {
      let character = new Character();

      character.setFlag(FLAGS.IS_JAMMED);
      expect(Combat.getAttackButton(character)).toEqual({
        name: "clear_jam",
        text: "Clear Jam",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.CLEAR_JAM}"}`
      });
    });

    it('should display reload button', () => {
      let character = new Character();
      character.weapon = new Weapon();
      character.weapon.needsReloading = jest.fn(() => true);

      expect(Combat.getAttackButton(character)).toEqual({
        name: "reload",
        text: "Reload",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.RELOAD}"}`
      });
    });

    it('should display attack button', () => {
      let character = new Character();
      character.weapon = new Weapon();
      character.weapon.needsReloading = jest.fn(() => false);

      expect(Combat.getAttackButton(character)).toEqual({
        name: "attack_1",
        style: "primary",
        text: "Attack [+1]",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.ATTACK}"}`
      });
    });
  });

  describe('getDefendButton()', () => {
    it('should display the defend button', () => {
      let character = new Character();

      expect(Combat.getDefendButton(character)).toEqual({
        name: "defend_3",
        style: "primary",
        text: "Defend [+3]",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.DEFEND}"}`
      });

      character.setFlag(FLAGS.DAZED_TURNS);
      expect(Combat.getDefendButton(character)).toEqual({
        name: "defend_3",
        style: "danger",
        text: "Defend [+3]",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.DEFEND}"}`
      });
    });
  });

  describe('getCastButton()', () => {
    it('should display the cast button', () => {
      let character = new Character();

      character.knownSpells = [];
      expect(Combat.getCastButton(character)).toBe(false);

      character.knownSpells = ['boom'];
      expect(Combat.getCastButton(character)).toEqual({
        name: "cast_1",
        style: "default",
        text: "Cast [-1]",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.CAST}"}`
      });

      character.setFlag(FLAGS.CANNOT_CAST);
      expect(Combat.getCastButton(character)).toEqual({
        name: "cast_1",
        style: "danger",
        text: "Cast [-1]",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.CAST}"}`
      });
    });
  });

  describe('getItemButton()', () => {
    it('should display the item button', () => {
      let character = new Character();

      expect(Combat.getItemButton(character)).toEqual({
        name: "item_1",
        style: "danger",
        text: "Item [-1]",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.ITEMS}"}`
      });

      character._stamina = 2;
      expect(Combat.getItemButton(character)).toEqual({
        name: "item_1",
        style: "default",
        text: "Item [-1]",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.ITEMS}"}`
      });
    });
  });

  describe('getRunButton()', () => {
    it('it should display the run button', () => {
      expect(Combat.getRunButton({})).toEqual({
        name: "run",
        text: "Run",
        type: "button",
        value: `fight_action|{"action":"${FIGHT_ACTIONS.RUN}"}`
      });
    });
  });
});