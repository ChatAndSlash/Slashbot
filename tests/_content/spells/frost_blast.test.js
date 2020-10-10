/*eslint-env mocha */
"use strict";

const FrostBlastSpell = require('@content/spells/frost_blast');
const Character       = require('@app/character').Character;
const Enemy           = require('@app/content/enemies').Enemy;

const FLAGS = require('@constants').FLAGS;

describe('FrostBlastSpell', () => {
  describe('castFighting', () => {
    it('should do a bunch of damage and chill enemy', () => {
      let character = new Character();
      character.setValues({ max_mp: 100, mp: 100 });
      character.enemy = new Enemy({ displayName: "BadGuy" });
      character.enemy.character = character;
      character.enemy._maxHp = 100;
      character.enemy.hp = 100;

      const spell = new FrostBlastSpell();
      spell.getSpellDamage = jest.fn(() => 10);

      expect(spell.castFighting(character)).toEqual([
        ":snowflake: You blast BadGuy with icy frost, dealing *10* damage.",
      ]);
      expect(character.mp).toBe(90);
      expect(character.enemy.hp).toBe(90);
      expect(character.enemy.getFlag(FLAGS.CHILLED_TURNS)).toBe(11);
    });
  });
});