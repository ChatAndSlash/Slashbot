/*eslint-env mocha */
"use strict";

const Character   = require('@app/character').Character;
const NullHallway = require('@content/locations/watermoon/scholar/hallway/null');

const FLAGS = require('@constants').FLAGS;

describe('Icy Hallway', () => {
  describe('chooseEnemy()', () => {
    it('should add cannot cast to the character', () => {
      let character = new Character();
      let hallway = new NullHallway();

      character.setValues({ level: 22 });
      character.location = hallway;
      hallway.getPoisonDamage = jest.fn(() => 10);
      hallway.pickRandomEnemy = jest.fn(() => 'watermoon-scholar-hallways-amphisbaena');

      expect(hallway.chooseEnemy(character, {})).toEqual(
        ":white_check_mark: You encountered a L22 Amphisbaena.\n:zipper_mouth_face: The walls of this hallway absorb all sound you make, rendering you unable to cast any spells!"
      );
      expect(character.hasFlag(FLAGS.CANNOT_CAST)).toBe(true);
    });
  });

  describe('doFightEnd()', () => {
    it('should clear cannot cast flag', () => {
      let character = new Character();
      let hallway = new NullHallway();

      character.setFlag(FLAGS.CANNOT_CAST);
      hallway.doFightEnd(character);

      expect(character.hasFlag(FLAGS.CANNOT_CAST)).toBe(false);
    });
  });
});

// also make sure that cast button doesn't exist if this flag set