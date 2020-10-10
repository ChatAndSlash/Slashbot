/*eslint-env mocha */
"use strict";

const LeaveLabyrinthCommand = require('@content/commands/labyrinth_leave');
const Character             = require('@app/character').Character;
const Locations             = require('@app/content/locations').Locations;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

describe('LeaveLabyrinthCommand', () => {
  describe('execute()', () => {
    it('should leave the Labyrinth', async () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAY_CHOICES, 'choices');
      character.setFlag(FLAGS.HALLWAY_REMAINING, 10);
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 17);
      character.location = Locations.new("watermoon-scholar-hallway-shortcut");

      let command = new LeaveLabyrinthCommand();
      command.updateLast = jest.fn();
      command.character = character;

      await command.execute();
      expect(character.getFlag(FLAGS.HALLWAY_CHOICES)).toBe(0);
      expect(character.getFlag(FLAGS.HALLWAY_REMAINING)).toBe(0);
      expect(character.getFlag(FLAGS.HALLWAYS_COMPLETED)).toBe(15);
      expect(character.state).toBe(CHARACTER_STATE.IDLE);
      expect(character.location.type).toBe('watermoon-scholar-quad');
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "You make your way out of the Labyrinth to the Scholar Quad, knowing you can always find your way back to crossroads #15."
          }]
        },
        doLook: true
      });
    });

    it('should have a different message for the first 4 crossroads', async () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 4);

      let command = new LeaveLabyrinthCommand();
      command.updateLast = jest.fn();
      command.character = character;

      await command.execute(character);
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "You make your way out of the Labyrinth to the Scholar Quad, knowing you can always find your way back to the first crossroads."
          }]
        },
        doLook: true
      });
    });

  });
});