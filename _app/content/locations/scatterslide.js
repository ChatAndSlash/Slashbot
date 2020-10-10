"use strict";

const Location = require('@app/content/locations').Location;
const Loot     = require('@app/loot').Loot;
const LootSlot = require('@app/loot').LootSlot;

/**
 * Scatterslide locations parent class.
 */
class ScatterslideLocation extends Location {
  /**
   * Get the loot contained in a Cursed Chest in this location.
   *
   * @param {Character} character - The character looting the Cursed Chest.
   *
   * @return {Loot}
   */
  getCursedChestLoot(character) {
    return new Loot(
      new LootSlot().addEntry(100, 'catalyst-quicksalt', 7, 10),
      new LootSlot().addEntry(50, 'consumables-potion', 3, 7).addEntry(50, 'consumables-elixir', 3, 7),
      new LootSlot().addEntry(100, 'torch', 10, 20),
    );
  }
}

module.exports = {
  ScatterslideLocation
};