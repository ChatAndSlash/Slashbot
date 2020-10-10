/*eslint-env mocha */
"use strict";

const Character  = require('@app/character').Character;
const Enemy      = require('@app/content/enemies').Enemy;
const StunAction = require('@mixins/enemy/actions/stun').StunAction;

const FLAGS = require('@constants').FLAGS;

describe('StunAction', () => {
  describe('getFightActions', () => {
    it('should set stun attack weight', () => {
      const StunAttackingEnemy = StunAction(50)(Enemy);
      const enemy = new StunAttackingEnemy();

      expect(enemy.getFightActions()).toEqual({
        doAttack: 50,
        doStun: 50
      });
    });
  });

  describe('doStun()', () => {
    it('should perform a stun attack', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 100 });
      const StunAttackingEnemy = StunAction(50)(Enemy);
      const enemy = new StunAttackingEnemy({ displayName: "BadGuy" });

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didDodge: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.doStun(character)).toEqual([
        ":dash: BadGuy attacks, but you dodge!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didMiss: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.doStun(character)).toEqual([
        "BadGuy attacks, but misses!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didCrit: true,
          damage: 10,
          extraMessages: [],
        };
      });
      expect(enemy.doStun(character)).toEqual([
        "BadGuy attacks you, dealing *10* damage and stunning you for 1 turns! _Critical hit!_"
      ]);
      expect(character.hp).toEqual(90);
      expect(character.getFlag(FLAGS.STUNNED_TURNS)).toBe(2);
    });
  });
});