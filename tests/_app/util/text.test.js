/*eslint-env mocha */
"use strict";

const Text = require("@util/text");

// -- Tests ----------------------------------------------------------------------------------------

describe('Text', () => {
  describe('getBuyUrl()', () => {
    it('should spit out a hashid link', () => {
      expect(Text.getBuyUrl({ id: 5 })).toBe("https://chatandslash.local/buy/?env=test&id=aE7K");
    });
  });
});