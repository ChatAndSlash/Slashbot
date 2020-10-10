/*eslint-env mocha */
"use strict";

const Character   = require('@app/character').Character;
const FoulHallway = require('@content/locations/watermoon/scholar/hallway/foul');

const FLAGS = require('@constants').FLAGS;

describe('Foul Hallway', () => {
  describe('chooseEnemy()', () => {
    it('should add poison to the character', () => {
      let character = new Character();
      let hallway = new FoulHallway();

      character.setValues({ level: 22 });
      character.location = hallway;
      hallway.getPoisonDamage = jest.fn(() => 10);
      hallway.pickRandomEnemy = jest.fn(() => 'watermoon-scholar-hallways-amphisbaena');

      expect(hallway.chooseEnemy(character, {})).toEqual(
        ":white_check_mark: You encountered a L22 Amphisbaena.\n:cloud: You cough and wheeze, the poison from the hallway clogging your lungs."
      );
      expect(character.getFlag(FLAGS.POISON_DAMAGE)).toBe(10);
      expect(character.getFlag(FLAGS.POISONED_TURNS)).toBe(100);
    });
  });

  describe('getPoisonDamage()', () => {
    it('should calculate poison damage for characters', () => {
      let character = new Character();
      let hallway = new FoulHallway();

      character.getAttackInfo = jest.fn(() => {
        return { damage: 100 }; 
      });
      expect(hallway.getPoisonDamage(character)).toBe(50);
    });
  });
});