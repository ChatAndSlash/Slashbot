/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const HealSpell = require('@content/spells/heal');

describe('Heal', () => {
  let character, spell;

  beforeEach(() => {
    character = new Character();
    character.setValues({
      max_hp: 500,
      hp: 100,
      max_mp: 500,
      mp: 500,
      spell_power: 100
    });

    spell = new HealSpell();
  });

  describe('getDescription()', () => {
    it('should get an accurate description', () => {
      expect(spell.getDescription(character)).toBe("A powerful heal that restores 300 HP (200 + 100 from Spell Power).");
    });
  });

  describe('castIdle()', () => {
    it('should heal character when cast', () => {
      expect(spell.castIdle(character)).toBe(
        ":sparkles: You gather your will and direct a surge of magic through your body.  (-80 MP)  You heal 300 HP."
      );
    });
  });

  describe('castFighting()', () => {
    it('should heal character when cast', () => {
      expect(spell.castFighting(character)).toEqual([":sparkles: You gather your will and direct a surge of magic through your body.  (-80 MP)  You heal 300 HP."]);
    });
  });

  describe('performHeal()', () => {
    it('should perform the heal', () => {
      expect(spell.performHeal(character)).toBe(":sparkles: You gather your will and direct a surge of magic through your body.  (-80 MP)  You heal 300 HP.");
      expect(character.mp).toBe(420);
      expect(character.hp).toBe(400);
    });
  });
});