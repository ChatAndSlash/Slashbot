/*eslint-env mocha */
"use strict";

const Enemy         = require('@app/content/enemies').Enemy;
const Character     = require('@app/character').Character;
const ConcussAction = require('@mixins/enemy/actions/concuss').ConcussAction;

const FLAGS = require('@constants').FLAGS;

describe('ConcussAction', () => {
  describe('getFightActions()', () => {
    it('should set concuss action weight', () => {
      const ConcussingEnemy = ConcussAction(50)(Enemy);
      const enemy = new ConcussingEnemy();

      expect(enemy.getFightActions({})).toEqual({
        doAttack: 50,
        concuss: 50
      });
    });
  });

  describe('concuss()', () => {
    it('should concuss a character', () => {
      const ConcussingEnemy = ConcussAction(50)(Enemy);
      const enemy = new ConcussingEnemy({ displayName: "BadGuy" });
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 100 });

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didCrit: true,
          damage: 10,
          extraMessages: [],
        };
      });
      expect(enemy.concuss(character)).toEqual([
        "BadGuy strikes you soundly in the head, dealing *10* damage and concussing you! _Critical hit!_"
      ]);
      expect(character.getFlag(FLAGS.CONCUSSED_TURNS)).toBe(3);
      expect(character.hp).toBe(90);
    });
  });

  describe('doPostRoundActions()', () => {
    it('should add concuss timer messages', () => {
      const ConcussingEnemy = ConcussAction(50)(Enemy);
      const enemy = new ConcussingEnemy({ displayName: "BadGuy" });
      let character = new Character();

      character.setFlag(FLAGS.CONCUSSED_TURNS, 2);
      expect(enemy.doPostRoundActions(character)).toEqual([
        ":dizzy_face: You are concussed and cannot use any skills for 2 turns."
      ]);

      character.setFlag(FLAGS.CONCUSSED_TURNS, 1);
      expect(enemy.doPostRoundActions(character)).toEqual([
        ":dizzy_face: You are concussed and cannot use any skills for 1 turn."
      ]);
    });
  });
});

// end of turn should have # of turns concussed added to it