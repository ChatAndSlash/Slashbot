/*eslint-env mocha */
"use strict";

const DoubleheadCoin = require('@content/items/reputation/doublehead_coin');
const Character      = require('@app/character').Character;

const STATS  = require('@constants').STATS;

// -- Tests ----------------------------------------------------------------------------------------

describe('Doublehead Coin', () => {
  describe('doBuyActions()', () => {
    it('should add 1000 reputation and say it', () => {
      let character = (new Character()).setValues();
      character.slashbot = { say: jest.fn() };

      const coin = new DoubleheadCoin();
      coin.doBuyActions(character, 1);

      expect(character.getStat(STATS.REPUTATION_GAINED, STATS.WATERMOON_REPUTATION)).toBe(1000);

      expect(character.slashbot.say).toHaveBeenCalledWith(":speaking_head_in_silhouette: You gained 1000 Watermoon reputation.", character);

    });
  });
});

