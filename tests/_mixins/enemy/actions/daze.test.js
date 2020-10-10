/*eslint-env mocha */
"use strict";

const Character  = require('@app/character').Character;
const Enemy      = require('@app/content/enemies').Enemy;
const DazeAction = require('@mixins/enemy/actions/daze').DazeAction;

const FLAGS = require('@constants').FLAGS;

describe('DazeAction', () => {
  describe('getFightActions', () => {
    it('should set daze attack weight', () => {
      const DazeAttackingEnemy = DazeAction(50)(Enemy);
      const enemy = new DazeAttackingEnemy();

      expect(enemy.getFightActions()).toEqual({
        doAttack: 50,
        daze: 50
      });
    });
  });

  describe('daze()', () => {
    it('should perform a daze attack', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 100 });
      const DazeAttackingEnemy = DazeAction(50)(Enemy);
      const enemy = new DazeAttackingEnemy({ displayName: "BadGuy" });

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didDodge: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.daze(character)).toEqual([
        ":dash: BadGuy attacks, but you dodge!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didMiss: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.daze(character)).toEqual([
        "BadGuy attacks, but misses!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didCrit: true,
          damage: 10,
          extraMessages: [],
        };
      });
      expect(enemy.daze(character)).toEqual([
        ":dizzy_face: BadGuy attacks and hits you squarely in the head, dealing *10* damage and dazing you for 5 turns. _Critical hit!_"
      ]);
      expect(character.hp).toEqual(90);
      expect(character.getFlag(FLAGS.DAZED_TURNS)).toBe(6);
    });
  });
});