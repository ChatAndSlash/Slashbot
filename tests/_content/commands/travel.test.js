/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const TravelCommand = require('@content/commands/travel');

describe('TravelCommand', () => {
  describe('execute', () => {
    it('should provide errors when you cannot travel', async () => {
      let character = new Character();
      character.canTravelTo = jest.fn(() => false);
      character.getTravelErrorMessage = jest.fn(() => "travel error message");

      let command = new TravelCommand();
      command.character = character;
      command.info = { to: 'location' };
      command.updateLast = jest.fn();

      await command.execute();

      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: "travel error message"
          }]
        },
        doLook: true
      });
    });

    it('should move you like a rhythm, baby', async () => {
      let character = new Character().setValues();
      character.canTravelTo = jest.fn(() => true);

      let command = new TravelCommand();
      command.character = character;
      command.info = { to: 'stagecoach' };
      command.updateLast = jest.fn();

      await command.execute();

      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: ":white_check_mark: You spent 1 AP and travelled to Stagecoach."
          }]
        },
        doLook: true
      });
      expect(character.ap).toBe(4);
    });
  });
});