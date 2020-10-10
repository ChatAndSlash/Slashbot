/*eslint-env mocha */
"use strict";

const PlaneOfFaithLocation = require('@content/locations/watermoon/mystic/plane_of_faith');

describe('Plane of Shadow', () => {
  describe('getPossibleLocations()', () => {
    it('All random locations should be safe to spawn at', () => {
      let plane = new PlaneOfFaithLocation();

      for (const layout of [0, 1, 2]) {
        const tiles = plane.getTiles(layout);
        for (const quadrant of [0, 1, 2, 3]) {
          for (const location of plane.getPossibleLocations(layout, quadrant)) {
            const msg = `Invalid tile '${tiles[location.y][location.x]}' at ${location.x},${location.y} in layout ${layout}.`;
            const isPassable = plane.isTilePassable(tiles[location.y][location.x]);
            expect(isPassable, msg).toBe(true);
          }
        }
      }
    });
  });
});