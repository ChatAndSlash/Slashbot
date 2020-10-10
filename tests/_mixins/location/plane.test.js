/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const PlaneLocation     = require('@mixins/location/plane').PlaneLocation;


describe('Plane', () => {
  describe('setPlayerLocation', () => {
    it('should set a player to a valid location', () => {
      const Plane = PlaneLocation()(WatermoonLocation);
      const location = new Plane();
      location.getPlaneSize = jest.fn(() => 9);
      location.getPlaneType = jest.fn(() => 'test');

      const character = new Character();

      location.setPlayerLocation(character, 5, 5);
      expect(character.getFlag('test_location')).toEqual({ x: 5, y: 5 });

      location.setPlayerLocation(character, -1, 5);
      expect(character.getFlag('test_location')).toEqual({ x: 0, y: 5 });

      location.setPlayerLocation(character, 5, 20);
      expect(character.getFlag('test_location')).toEqual({ x: 5, y: 9 });
    });
  });
});