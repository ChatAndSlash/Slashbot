/*eslint-env mocha */
"use strict";

const HoarfrostSpikeSpell = require('@content/spells/hoarfrost_spike');
const Character           = require('@app/character').Character;
const Enemy               = require('@app/content/enemies').Enemy;

const FLAGS = require('@constants').FLAGS;

describe('HoarfrostSpikeSpell', () => {
  describe('castFighting', () => {
    it('should do a bunch of damage and chill enemy', () => {
      let character = new Character();
      character.setValues({ max_mp: 100, mp: 100 });
      character.enemy = new Enemy({ displayName: "BadGuy" });
      character.enemy.character = character;
      character.enemy._maxHp = 100;
      character.enemy.hp = 100;

      const spell = new HoarfrostSpikeSpell();
      spell.getSpellDamage = jest.fn(() => 10);

      expect(spell.castFighting(character)).toEqual([
        ":snowflake: You hurl a spike of hoarfrost at BadGuy, dealing *10* damage.",
      ]);
      expect(character.mp).toBe(85);
      expect(character.enemy.hp).toBe(90);
      expect(character.enemy.getFlag(FLAGS.CHILLED_TURNS)).toBe(11);
    });
  });
});