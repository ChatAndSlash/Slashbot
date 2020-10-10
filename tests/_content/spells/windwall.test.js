/*eslint-env mocha */
"use strict";

const WindwallSpell = require('@content/spells/windwall');
const Character     = require('@app/character').Character;
const Enemy         = require('@app/content/enemies').Enemy;

const FLAGS = require('@constants').FLAGS;

const WINDWALL_TURNS = require('@constants').WINDWALL_TURNS;

// -- Tests ----------------------------------------------------------------------------------------

describe('WindwallSpell', () => {
  describe('castFighting', () => {
    it('should set up a wall of wind', () => {
      let character = new Character();
      character.setValues({ max_mp: 100, mp: 100 });
      character.enemy = new Enemy({ displayName: "BadGuy" });

      const spell = new WindwallSpell();
      spell.getSpellDamage = jest.fn(() => 10);

      expect(spell.castFighting(character)).toEqual([
        ":wind_blowing_face: Starting with a small breeze and culminating with a massive gust, you set up a wall of wind between you and BadGuy."
      ]);
      expect(character.mp).toBe(90);
      expect(character.enemy.getFlag(FLAGS.WINDWALL_TURNS)).toBe(WINDWALL_TURNS + 1);
      expect(character.enemy.getFlag(FLAGS.WINDWALL_DAMAGE)).toBe(10);
    });
  });

  describe('blow()', () => {
    it('should blow enemies around', () => {
      let character = new Character();
      character.setValues();

      character.enemy = new Enemy({ displayName: "BadGuy" });
      character.enemy.character = character;
      character.enemy.maxHp = 100;
      character.enemy._hp = 100;
      character.enemy.setFlag(FLAGS.WINDWALL_TURNS, 5);
      character.enemy.setFlag(FLAGS.WINDWALL_DAMAGE, 10);
      character.enemy.setFlag(FLAGS.IS_RANGED);
      character.setFlag(FLAGS.IS_RANGED);

      WindwallSpell.isKnockedBack = jest.fn(() => true);

      expect(WindwallSpell.blow(character.enemy, character)).toEqual([
        "BadGuy is blown about by the wind, takes *10* damage, is chilled, and is knocked back to range!"
      ]);
      expect(character.enemy.hp).toBe(90);
      expect(character.enemy.hasFlag(FLAGS.IS_RANGED)).toBe(true);
      expect(character.hasFlag(FLAGS.IS_RANGED)).toBe(true);

      WindwallSpell.isKnockedBack = jest.fn(() => false);

      expect(WindwallSpell.blow(character.enemy, character)).toEqual([
        "BadGuy is blown about by the wind and takes *10* damage and is chilled, but manages to bully through and close the distance!"
      ]);
      expect(character.enemy.hp).toBe(80);
      expect(character.enemy.hasFlag(FLAGS.IS_RANGED)).toBe(false);
      expect(character.hasFlag(FLAGS.IS_RANGED)).toBe(false);
    });
  });
});