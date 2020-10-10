"use strict";

const { Actions, Options, Attachments } = require('slacksimple');

const { Command } = require('@app/content/commands');
const { Items }   = require('@app/content/items');
const { Spells }  = require('@app/content/spells');

const { getPropertyName } = require('@util/text');

const { STATS, COLORS } = require('@constants');

const COMMAND_NAME    = 'buy';

const ACTION_LIST     = 'list';
const ACTION_CONFIRM  = 'confirm';
const ACTION_QUANTITY = 'quantity';
const ACTION_BUY      = 'buy';

const CONFIRM_SELL = 'sell';
const CONFIRM_KEEP = 'keep';

/**
 * Buy items from a store.
 */
class BuyCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === ACTION_LIST) {
      await this.showItemsForSale();
    }
    else if (this.info.action === ACTION_CONFIRM) {
      await this.showConfirm();
    }
    else if (this.info.action === ACTION_QUANTITY) {
      await this.showQuantities();
    }
    else if (this.info.action === ACTION_BUY) {
      await this.buy();
    }
  }

  /**
   * Show a list of items for sale at this location.
   */
  async showItemsForSale() {
    const character = this.character;

    let description = character.location.getDescription(character)
      + character.location.getShopDescription(character, this.info.type);

    let attachments = new Attachments().add({
      title: "What do you want to buy?",
      fields: character.getFields(),
      color: COLORS.INFO
    });

    [description, attachments] = this.getEquipmentForSale(character, description, attachments);
    [description, attachments] = this.getSpellsForSale(character, description, attachments);
    [description, attachments] = this.getItemsForSale(character, description, attachments);

    attachments.addButton("Cancel", "look", { params: { resetDescription: "true" } });

    await this.updateLast({ description, attachments });
  }

  /**
   * Get the list of equipment for sale at this location.
   *
   * @param {Character} character - The character doing the shopping.
   * @param {string} description - The current description of this location & shop.
   * @param {Attachments} attachments - Attachments to update the most-recent message with.
   *
   * @return [description, attachment]
   */
  getEquipmentForSale(character, description, attachments) {
    const shopEquipment = character.location.getShopEquipmentByType(character, this.info.type);

    if ( ! _.isEmpty(shopEquipment)) {
      description  +=  "\n\nYou review the equipment you can use:";
      let options = new Options;

      for (const itemType of shopEquipment) {
        description += this.addEquipmentOption(character, options, itemType);
      }
      attachments.addSelect("Equipment", COMMAND_NAME, options.getCollection());
    }

    return [description, attachments];
  }

  /**
   * Add a piece of equipment to a collection of options for purchase.
   *
   * @param {Character} character - The character potentially buying the equipment.
   * @param {Options} options - The options to add to.
   * @param {string} itemType - The type of the item to add.
   *
   * @return {string} The description to add for this piece of equipment.
   */
  addEquipmentOption(character, options, itemType) {
    let description = '';

    const item = Items.new(itemType);
    const canEquip = character.level >= item.level;
    const isEquipped = character[item.equipType].type === item.type;
    const canEquipText = (canEquip && ! isEquipped && item.canBePurchasedBy(character)) ? '✓' : '✗';

    options.add(`${item.getButtonText(character)} ${canEquipText}`, { action: ACTION_CONFIRM, item: item.type });
    description += `\n>- *${item.getDisplayName(character)}* _(${item.gold}g, Lv.${item.level} ${canEquipText})_: ${item.getShopDescription(character)}`;

    // Identify what extra properties this item has
    const extraProperties = item.properties.filter(property => 'is_attack' !== property);

    if (extraProperties.length) {
      const properties = extraProperties.map((property) => getPropertyName(property, character));
      description += ` _(${properties.join(", ")})_`;
    }

    return description;
  }

  /**
   * Get the list of spells for sale at this location.
   *
   * @param {Character} character - The character doing the shopping.
   * @param {string} description - The current description of this location & shop.
   * @param {Attachments} attachments - Attachments to update the most-recent message with.
   *
   * @return [description, attachment]
   */
  getSpellsForSale(character, description, attachments) {
    const shopSpells = character.location.getShopSpellsByType(character, this.info.type);

    if ( ! _.isEmpty(shopSpells)) {
      description += "\n\nYou review the spells on offer:";
      let options = new Options;

      for (const spellType of shopSpells) {
        description += this.addSpellOption(character, options, spellType);
      }

      if (options.length) {
        attachments.addSelect("Spells", COMMAND_NAME, options.getCollection());
      }
      else {
        description += "\n\n> *No spells remain to be purchased.*";
      }
    }

    return [description, attachments];
  }

  /**
   * Add a spell to a collection of options for purchase.
   *
   * @param {Character} character - The character potentially buying the spell.
   * @param {Options} options - The options to add to.
   * @param {string} spellType - The type of the spell to add.
   *
   * @return {string} The description to add for this piece of spell.
   */
  addSpellOption(character, options, spellType) {
    let description = '';

    if ( ! character.knowsSpell(spellType)) {
      const spell = Spells.new(spellType);
      const canBuyText = spell.canBePurchasedBy(character) ? '✓' : '✗';

      options.add(`${spell.getDisplayName(character)} ${canBuyText}`, { action: ACTION_BUY, spell: spell.type });
      description += `\n>- *${spell.getDisplayName(character)} (${spell.getCostDescription(character)}, ${spell.getMpCost(character)}MP):* ${spell.getDescription(character)}`;

      if (spell.properties.length) {
        let properties = spell.properties.map((property) => getPropertyName(property, character));
        description += ` _(${properties.join(", ")})_`;
      }
    }

    return description;
  }

  /**
   * Get the list of items for sale at this location.
   *
   * @param {Character} character - The character doing the shopping.
   * @param {string} description - The current description of this location & shop.
   * @param {Attachments} attachments - Attachments to update the most-recent message with.
   *
   * @return [description, attachment]
   */
  getItemsForSale(character, description, attachments) {
    const shopItems = character.location.getShopItemsByType(character, this.info.type);

    if ( ! _.isEmpty(shopItems)) {
      description += "\n\nYou review the items for sale:";
      let options = new Options();

      for (const itemType of shopItems) {
        // If a piece of equipment made it in here, show appropriate option
        if (itemType.substring(0, 9) === 'equipment') {
          description += this.addEquipmentOption(character, options, itemType);
        }
        else {
          description += this.addItemOption(character, options, itemType);
        }
      }

      attachments.addSelect("Items", COMMAND_NAME, options.getCollection());
    }

    return [description, attachments];
  }

  /**
   * Add an item to a collection of options for purchase.
   *
   * @param {Character} character - The character potentially buying the item.
   * @param {Options} options - The options to add to.
   * @param {string} itemType - The type of the item to add.
   *
   * @return {string} The description to add for this piece of item.
   */
  addItemOption(character, options, itemType) {
    const item = Items.new(itemType);
    const canBuyText = item.canBePurchasedBy(character) ? '✓' : '✗';

    options.add(`${item.getDisplayName(character)} ${canBuyText}`, { action: ACTION_QUANTITY, item: itemType });
    return `\n>- *${item.getDisplayName(character)}* _(${item.getCostDescription(character)})_: ${item.getShopDescription(character)}`;
  }

  /**
   * When buying equipment, figure out if player wants to sell their old equipment or keep it.
   */
  async showConfirm() {
    const character = this.character;
    const buyItem   = Items.new(this.info.item);

    // If item is equipment, and character already has the item equipped
    if (buyItem.equipType && character[buyItem.equipType].type === buyItem.type) {
      await this.updateLast({
        attachments: Attachments.one({
          title: "You already own that!",
          color: COLORS.WARNING
        }),
        doLook: true,
      });

      // If item is equipment, and character isn't high enough level to equip it
    }
    else if (buyItem.equipType && character.level < buyItem.level) {
      await this.updateLast({
        attachments: Attachments.one({
          title: `You're only level ${character.level}, and not high enough to equip that!`,
          color: COLORS.WARNING
        }),
        doLook: true,
      });

      // If character can't afford the item
    }
    else if ( ! buyItem.canBePurchasedBy(character, this.info.quantity)) {
      await this.updateLast({
        attachments: Attachments.one({
          title: ":warning: You can't afford that.",
          color: COLORS.WARNING
        }),
        doLook: true,
      });

      // If character can afford the item
    }
    else {
      const oldItem  = character[buyItem.equipType];
      let actions = new Actions();
      let description = `Fantastic choice.  And did you want to sell your old ${oldItem.getDisplayName(character)} for *${oldItem.getSellPriceDescription(character)}*`;
      actions.addButton("Sell", COMMAND_NAME, { params: { action: ACTION_BUY, item: this.info.item, confirm: CONFIRM_SELL }});

      if (character.equipment.hasFreeSlot(buyItem.equipType, character)) {
        description += " or keep it";
        actions.addButton("Keep", COMMAND_NAME, { params: { action: ACTION_BUY, item: this.info.item, confirm: CONFIRM_KEEP }});
      }

      description += "?";
      actions.addButton("Cancel", "look", { params: { resetDescription: "true" } });

      await this.updateLast({
        description,
        attachments: Attachments.one({
          actions,
          fields: character.getFields(),
          color: COLORS.INFO
        })
      });
    }
  }

  /**
   * When buying items, show the quantities they can be bought in.
   */
  async showQuantities() {
    const character = this.character;
    const item      = this.info.item;
    const buyItem   = Items.new(item);
    let actions = new Actions();

    let style = buyItem.canBePurchasedBy(character, 1) ? 'default' : 'danger';
    actions.addButton("Buy 1", COMMAND_NAME, { params: { action: ACTION_BUY, item, quantity: 1 }, style });

    style = buyItem.canBePurchasedBy(character, 5) ? 'default' : 'danger';
    actions.addButton("Buy 5", COMMAND_NAME, {params: { action: ACTION_BUY, item, quantity: 5 }, style });

    style = buyItem.canBePurchasedBy(character, 10) ? 'default' : 'danger';
    actions.addButton("Buy 10", COMMAND_NAME, { params: { action: ACTION_BUY, item, quantity: 10 }, style });

    style = buyItem.canBePurchasedBy(character, 25) ? 'default' : 'danger';
    actions.addButton("Buy 25", COMMAND_NAME, { params: { action: ACTION_BUY, item, quantity: 25 }, style });

    actions.addButton("Cancel", "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      attachments: Attachments.one({
        title: "How many do you want to buy?",
        fields: this.character.getFields(),
        actions
      })
    });
  }

  /**
   * Purchase item.  If equipment, sell old equipment and equip new one.
   */
  async buy() {
    const character = this.character;
    let title = '';
    let color;

    // If spell
    if (_.isDefined(this.info.spell)) {
      [color, title] = this.buySpell(character, this.info.spell);
    }
    else {
      const buyItem = Items.new(this.info.item);

      // If equipment
      if (buyItem.equipType) {
        [color, title] = this.buyEquipment(character, buyItem);
      }

      // If inventory item
      else {
        [color, title] = this.buyItem(character, buyItem, this.info.quantity);
      }
    }

    await this.updateLast({
      attachments: Attachments.one({ title, color }),
      fields: [],
      doLook: true
    });
  }

  /**
   * Buy a spell.
   *
   * @param {Character} character - The character buying the spell.
   * @param {string} type - The type of spell to buy.
   *
   * @return [color, title]
   */
  buySpell(character, type) {
    let title;
    let color = COLORS.GOOD;
    const buySpell = Spells.new(type);

    // If character can't afford the spell
    if ( ! buySpell.canBePurchasedBy(character)) {
      title = ":warning: You can't afford that.";
      color = COLORS.WARNING;
    }
    else {
      buySpell.subtractCostFrom(character, this.info.quantity);
      character.learnSpell(type);

      const costDescription = buySpell.getCostDescription(character);
      const displayName = buySpell.getDisplayName(character);
      title = `You hand over ${costDescription} and after a few hours of study, you learn to cast ${displayName}!`;
    }

    return [color, title];
  }

  /**
   * Buy new and sell/keep old equipmnet.
   *
   * @param {Character} character - The character buying new equipment.
   * @param {Equipment} buyEquipment - The equipment being bought.
   *
   * @return [color, title]
   */
  buyEquipment(character, buyEquipment) {
    buyEquipment.subtractCostFrom(character);
    buyEquipment.doBuyActions(character, 1);

    const oldEquipment = character[buyEquipment.equipType];
    let goldWarningText = "";

    // If selling old item
    if (this.info.confirm === CONFIRM_SELL) {
      if (oldEquipment.willExceedMaxGold(character)) {
        goldWarningText = "  You've reached your maximum gold!  Maybe visit the Exchange and pick up some Alchemy Catalysts for some enhancement flasks?";
      }
      else if (oldEquipment.willApproachMaxGold(character)) {
        goldWarningText = "  You're nearing your maximum gold!  Maybe visit the Exchange and pick up some Alchemy Catalysts for some enhancement flasks?";
      }

      character.increaseStat(STATS.EQUIPMENT_SOLD, 1, oldEquipment.equipType);
      oldEquipment.addSellPriceTo(character);
    }
    // If keeping old item
    else {
      character.equipment.add(oldEquipment.type, oldEquipment.equipType);
    }

    const title = buyEquipment.getBuyText(character, oldEquipment, buyEquipment, this.info.confirm)
      + goldWarningText;

    oldEquipment.unequipFrom(character);
    buyEquipment.equipTo(character);

    character.increaseStat(STATS.EQUIPMENT_PURCHASED, 1, buyEquipment.equipType);

    character.track('Equipment Purchased', {
      type: buyEquipment.type
    });

    return [COLORS.GOOD, title];
  }

  /**
   * Buy items.
   *
   * @param {Character} character - The character buying items.
   * @param {Item} buyItem - The item being bought.
   * @param {integer} quantity - The number of items to buy.
   *
   * @return [color, title]
   */
  buyItem(character, buyItem, quantity) {
    let title;
    let color = COLORS.GOOD;

    // Over max inventory quantity or can't afford
    if ( ! buyItem.canBePurchasedBy(character, quantity)) {
      title = buyItem.getCannotPurchaseError(character, quantity, buyItem.getDisplayName(character));
      color = COLORS.WARNING;
    }
    // Buy that item!
    else {
      buyItem.subtractCostFrom(character, quantity);
      character.inventory.add(buyItem.type, quantity);
      buyItem.doBuyActions(character, quantity);

      const displayName = quantity > 1 ? `${buyItem.getDisplayName(character)} x${quantity}` : buyItem.getDisplayName(character);
      title = `You plunk down the asking price and collect your ${displayName}.`;
    }

    return [color, title];
  }
}

module.exports = BuyCommand;