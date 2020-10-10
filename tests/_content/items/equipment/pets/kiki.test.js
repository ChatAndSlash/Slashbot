/*eslint-env mocha */
"use strict";

const Kiki    = require('@content/items/equipment/pets/kiki');
const Character = require('@app/character').Character;
const Enemy     = require('@app/content/enemies').Enemy;

const FLAGS = require('@constants').FLAGS;

// -- Tests ----------------------------------------------------------------------------------------

describe('Kiki', () => {
  describe('doPetAction()', () => {
    it('should perform a chill attack', () => {
      let pet = new Kiki();
      pet.shouldAttack = jest.fn(() => true);

      let character = (new Character()).setValues();

      character.enemy = new Enemy();
      character.enemy.character = character;
      character.enemy._displayName = "Jerk";
      character.enemy.maxHp = 100;
      character.enemy.hp = 100;

      expect(pet.doPetAction(character, {}, [])).toEqual([
        "Kiki bares her frosty teeth and attacks Jerk for *8* damage!"
      ]);
      expect(character.enemy.hp).toBe(92);
      expect(character.enemy.getFlag(FLAGS.CHILLED_TURNS)).toBe(11);
    });

    it('should do nothing against a dead opponent', () => {
      let pet = new Kiki();
      pet.shouldAttack = jest.fn(() => true);

      let character = (new Character()).setValues();

      character.enemy = new Enemy();
      character.enemy.hp = 0;

      expect(pet.doPetAction(character, {}, [])).toEqual([]);
    });
  });
});