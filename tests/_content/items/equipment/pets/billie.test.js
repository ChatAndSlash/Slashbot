/*eslint-env mocha */
"use strict";

const Billie    = require('@content/items/equipment/pets/billie');
const Character = require('@app/character').Character;
const Enemy     = require('@app/content/enemies').Enemy;

const FLAGS = require('@constants').FLAGS;

// -- Tests ----------------------------------------------------------------------------------------

describe('Billie', () => {
  describe('doPetAction()', () => {
    it('should perform a flaming attack', () => {
      let pet = new Billie();
      pet.shouldAttack = jest.fn(() => true);

      let character = (new Character()).setValues();

      character.enemy = new Enemy();
      character.enemy.character = character;
      character.enemy._displayName = "Jerk";
      character.enemy.maxHp = 100;
      character.enemy.hp = 100;

      expect(pet.doPetAction(character, {}, [])).toEqual([
        "Billie darts forward and nips excitedly at Jerk's heels!  More damaging though, is his flaming breath, which does *8* damage!"
      ]);
      expect(character.enemy.hp).toBe(92);
      expect(character.enemy.getFlag(FLAGS.BURNED_TURNS)).toBe(7);
    });

    it('should do more damage to a burned opponent', () => {
      let pet = new Billie();
      pet.shouldAttack = jest.fn(() => true);

      let character = (new Character()).setValues();

      character.enemy = new Enemy();
      character.enemy.character = character;
      character.enemy._displayName = "Jerk";
      character.enemy.maxHp = 100;
      character.enemy.hp = 100;
      character.enemy.addStatusBurned(1);

      expect(pet.doPetAction(character, {}, [])).toEqual([
        "Billie darts forward and nips excitedly at Jerk's heels!  More damaging though, is his flaming breath, which does *10* damage!",
        ":fire: Jerk is burned and takes extra damage from your burn attack!"
      ]);
      expect(character.enemy.hp).toBe(90);
      expect(character.enemy.getFlag(FLAGS.BURNED_TURNS)).toBe(7);
    });

    it('should do nothing against a dead opponent', () => {
      let pet = new Billie();
      pet.shouldAttack = jest.fn(() => true);

      let character = (new Character()).setValues();

      character.enemy = new Enemy();
      character.enemy.hp = 0;

      expect(pet.doPetAction(character, {}, [])).toEqual([]);
    });
  });
});