/*eslint-env mocha */
"use strict";

const FireballSpell = require('@content/spells/fireball');
const Character     = require('@app/character').Character;
const Enemy         = require('@app/content/enemies').Enemy;

const FLAGS = require('@constants').FLAGS;

describe('FireballSpell', () => {
  describe('castFighting', () => {
    it('should do a bunch of damage, including enemy being burned', () => {
      let character = new Character();
      character.setValues({ max_mp: 100, mp: 100 });
      character.enemy = new Enemy({ displayName: "BadGuy" });
      character.enemy.character = character;
      character.enemy._maxHp = 100;
      character.enemy.hp = 100;
      character.enemy.addStatusBurned(1);

      const spell = new FireballSpell();
      spell.getSpellDamage = jest.fn(() => 10);

      expect(spell.castFighting(character)).toEqual([
        ":fire: You form a ball of fire between your hands and hurl it at BadGuy, dealing *10* damage.",
        ":fire: BadGuy is burned and takes extra damage from your burn attack!"
      ]);
      expect(character.mp).toBe(80);
      expect(character.enemy.hp).toBe(90);
      expect(character.enemy.getFlag(FLAGS.BURNED_TURNS)).toBe(7);
    });
  });
});