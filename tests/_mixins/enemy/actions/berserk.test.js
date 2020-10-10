/*eslint-env mocha */
"use strict";

const Enemy         = require('@app/content/enemies').Enemy;
const Character     = require('@app/character').Character;
const BerserkAction = require('@mixins/enemy/actions/berserk').BerserkAction;

const FLAG_BERSERK_TURNS = 'berserk_turns';

describe('BerserkAction', () => {
  describe('chooseFightAction()', () => {
    it('should choose the berserk attack if berserk', () => {
      const BerserkEnemy = BerserkAction(50)(Enemy);
      let enemy = new BerserkEnemy();
      enemy.setFlag(FLAG_BERSERK_TURNS, 2);

      expect(enemy.chooseFightAction({})).toBe('berserkAttack');
    });
  });

  describe('getFightActions()', () => {
    it('should set berserk attack action weight', () => {
      const BerserkEnemy = BerserkAction(50)(Enemy);
      const enemy = new BerserkEnemy();

      expect(enemy.getFightActions({})).toEqual({
        doAttack: 50,
        getBerserk: 50
      });
    });
  });

  describe('doPostRoundActions()', () => {
    it('should decrement berserk counter', () => {
      const BerserkEnemy = BerserkAction(50)(Enemy);
      const enemy = new BerserkEnemy();
      enemy.setFlag(FLAG_BERSERK_TURNS, 2);

      enemy.doPostRoundActions({});

      expect(enemy.getFlag(FLAG_BERSERK_TURNS)).toBe(1);
    });
  });

  describe('getBerserk()', () => {
    it('should set the berserk flag and perform a berserk attack', () => {
      const BerserkEnemy = BerserkAction(50)(Enemy);
      const enemy = new BerserkEnemy();
      enemy.berserkAttack = jest.fn();
      let character = (new Character()).setValues();

      enemy.getBerserk(character);

      expect(enemy.getFlag(FLAG_BERSERK_TURNS)).toBe(3);
      expect(enemy.berserkAttack).toHaveBeenCalledWith(character);
    });
  });

  describe('attackerModifyAttackParameters()', () => {
    it('should increase attack multiplier when berserked', () => {
      const BerserkEnemy = BerserkAction(50)(Enemy);
      const enemy = new BerserkEnemy();
      enemy.setFlag(FLAG_BERSERK_TURNS, 2);

      const params = enemy.attackerModifyAttackParameters({ multiplier: 1 }, {});

      expect(params.multiplier).toBe(2);
    });
  });

  describe('berserkAttack()', () => {
    it('should perform a power attack', () => {
      let character = (new Character()).setValues();
      character.setValues({ max_hp: 100, hp: 100 });
      const BerserkEnemy = BerserkAction(50)(Enemy);
      const enemy = new BerserkEnemy({ displayName: "BadGuy" });
      enemy.setFlag(FLAG_BERSERK_TURNS, 2);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didDodge: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.berserkAttack(character)).toEqual([
        ":dash: BadGuy attacks, but you dodge!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didMiss: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.berserkAttack(character)).toEqual([
        "BadGuy attacks, but misses!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didCrit: true,
          damage: 10,
          extraMessages: [],
        };
      });
      expect(enemy.berserkAttack(character)).toEqual([
        "BadGuy attacks you for for *10* damage! _Critical hit!_",
        "BadGuy has gone berserk and will only attack for 1 more turns!"
      ]);
      expect(character.hp).toBe(90);
    });
  });
});