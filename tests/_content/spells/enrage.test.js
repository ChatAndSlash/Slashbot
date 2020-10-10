/*eslint-env mocha */
"use strict";

const EnrageSpell = require('@content/spells/enrage');
const Character   = require('@app/character').Character;
const Enemy       = require('@app/content/enemies').Enemy;

const FLAGS = require('@constants').FLAGS;

// -- Tests ----------------------------------------------------------------------------------------

describe('EnrageSpell', () => {
  describe('castFighting', () => {
    it('should enrage the enemy', () => {
      let character = new Character();
      character.setValues({ max_mp: 100, mp: 100 });
      character.enemy = new Enemy({ displayName: "BadGuy" });

      const spell = new EnrageSpell();

      spell.doesEnrage = jest.fn(() => false);
      expect(spell.castFighting(character)).toEqual([
        "Red streaks fly from your hands at BadGuy.  They shake their heads confusion for a moment, then re-engage you."
      ]);
      expect(character.mp).toBe(80);
      expect(character.enemy.hasFlag(FLAGS.ENRAGED_TURNS)).toBe(false);

      spell.doesEnrage = jest.fn(() => true);
      expect(spell.castFighting(character)).toEqual([
        "Red streaks fly from your hands at BadGuy.  They lose their cool and fly into a rage!"
      ]);
      expect(character.mp).toBe(60);
      expect(character.enemy.hasFlag(FLAGS.ENRAGED_TURNS, 4));
    });
  });
});