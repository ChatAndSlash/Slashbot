"use strict";

const { getArticle } = require('@util/text');
const { BoostItem } = require("@app/content/items/boost");

/**
 * Party boost item parent class.
 */
class PartyBoostItem extends BoostItem {
  /**
   * Boost items are "dummy" items.  They can be bought, but should never go into your inventory.
   *
   * @param {Character} character - The character buying this item.
   * @param {integer} quantity - The quantity of items being bought.
   */
  doBuyActions(character, quantity) {
    super.doBuyActions(character, quantity);

    if (character.party) {
      const boostName = this.getDisplayName(character);
      const boostArticle = getArticle(boostName);

      for (let member of character.party.otherMembers(character)) {
        member.addBoost(this.boostType);
        member.save({ saveParty: false, saveEnemy: false });

        const memberPartyCharacter = character.slashbot.getNpc('party', member);
        character.slashbot.dm(
          `${character.getTrueName()} has purchased ${boostArticle} ${boostName} for your party!`,
          memberPartyCharacter,
        );
      }
    }
  }
}

module.exports = {
  PartyBoostItem
};
