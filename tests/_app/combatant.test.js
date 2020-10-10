/*eslint-env mocha */
"use strict";

const Combatant = require('@app/combatant');

const FLAGS = require('@constants').FLAGS;

describe('Combatant', () => {
  describe('doPostRoundActions()', () => {
    it('should decrement post-round statuses', () => {
      let combatant = new Combatant();
      combatant.setFlag(FLAGS.STUNNED_TURNS, 5);

      combatant.doPostRoundActions({});
      expect(combatant.getFlag(FLAGS.STUNNED_TURNS)).toBe(4);
    });

    it('should clear single-round statuses', () => {
      let combatant = new Combatant();
      combatant.setFlag(FLAGS.DAMAGE_MODIFIER);

      combatant.doPostRoundActions({});
      expect(combatant.getFlag(FLAGS.DAMAGE_MODIFIER)).toBe(0);
    });

    it('should handle burned status', () => {
      let combatant = new Combatant();

      combatant.isCharacter = jest.fn(() => true);
      combatant.addStatusBurned(1);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":fire: You are burned for 1 turn and will take more damage from Burn attacks!"
      ]);

      combatant.addStatusBurned(2);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":fire: You are burned for 2 turns and will take more damage from Burn attacks!"
      ]);

      combatant.isCharacter = jest.fn(() => false);
      combatant.getDisplayName = jest.fn(() => 'Spider');
      combatant.isAre = 'is';
      combatant.addStatusBurned(2);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":fire: Spider is burned for 2 turns and will take more damage from Burn attacks!"
      ]);
    });

    it('should handle chilled status', () => {
      let combatant = new Combatant();

      combatant.isCharacter = jest.fn(() => true);
      combatant.addStatusChilled(1);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":snowflake: You are chilled for 1 turn and will have a harder time dodging!"
      ]);

      combatant.addStatusChilled(2);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":snowflake: You are chilled for 2 turns and will have a harder time dodging!"
      ]);

      combatant.isCharacter = jest.fn(() => false);
      combatant.getDisplayName = jest.fn(() => 'Spider');
      combatant.isAre = 'is';
      combatant.addStatusChilled(2);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":snowflake: Spider is chilled for 2 turns and will have a harder time dodging!"
      ]);
    });

    it('should handle poisoned status', () => {
      let combatant = new Combatant();

      combatant.isCharacter = jest.fn(() => true);
      combatant.setFlag(FLAGS.POISONED_TURNS, 3);
      combatant.setFlag(FLAGS.POISON_DAMAGE, 10);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":face_vomiting: Poison burns in your veins for 10 damage (1 turns remaining)."
      ]);

      combatant.isCharacter = jest.fn(() => true);
      combatant.setFlag(FLAGS.POISONED_TURNS, 2);
      combatant.setFlag(FLAGS.POISON_DAMAGE, 10);
      expect(combatant.doPostRoundActions({})).toEqual([
        ":face_vomiting: Poison burns in your veins for 10 damage."
      ]);

      combatant.isCharacter = jest.fn(() => false);
      combatant.setFlag(FLAGS.POISONED_TURNS, 2);
      combatant.setFlag(FLAGS.POISON_DAMAGE, 10);
      combatant.getDisplayName = jest.fn(() => 'Spider');
      expect(combatant.doPostRoundActions({})).toEqual([
        ":face_vomiting: Poison burns in Spider's veins for 10 damage."
      ]);
    });
  });
});