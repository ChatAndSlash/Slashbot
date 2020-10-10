/*eslint-env mocha */
"use strict";

const BuyCommand = require('@content/commands/buy');

const Attachments = require('slacksimple').Attachments;
const Character   = require('@app/character').Character;
const Equipment   = require('@app/equipment');
const Inventory   = require('@app/inventory');
const Location    = require('@app/content/locations').Location;
const Items       = require('@app/content/items').Items;

const COLORS = require('@constants').COLORS;
const STATS  = require('@constants').STATS;

describe('BuyCommand', () => {
  let character;
  let command;

  beforeEach(() => {
    character = (new Character()).setValues();
    character.setValues({});
    character.inventory = new Inventory();
    character.equipment = new Equipment();
    character.location  = new Location({ description: "The location description." });

    command = new BuyCommand(character);
    command.updateLast = jest.fn();
  });

  describe('execute()', () => {
    it('should execute the correct stage of the command', async () => {
      command.showItemsForSale = jest.fn();
      command.info.action = "list";
      await command.execute();
      expect(command.showItemsForSale).toHaveBeenCalled();

      command.showConfirm = jest.fn();
      command.info.action = "confirm";
      await command.execute();
      expect(command.showConfirm).toHaveBeenCalled();

      command.showQuantities = jest.fn();
      command.info.action = "quantity";
      await command.execute();
      expect(command.showQuantities).toHaveBeenCalled();

      command.buy = jest.fn();
      command.info.action = "buy";
      await command.execute();
      expect(command.buy).toHaveBeenCalled();
    });
  });

  describe('showItemsForSale()', () => {
    it('should amalgamate all the equipment, spells, and items for sale', async () => {
      command.getEquipmentForSale = jest.fn((c, d, a) => [d, a]);
      command.getSpellsForSale = jest.fn((c, d, a) => [d, a]);
      command.getItemsForSale = jest.fn((c, d, a) => [d, a]);
      command.updateLast = jest.fn();
      character.getFields = jest.fn(() => []);

      await command.showItemsForSale();

      expect(command.getEquipmentForSale).toHaveBeenCalled();
      expect(command.getSpellsForSale).toHaveBeenCalled();
      expect(command.getItemsForSale).toHaveBeenCalled();
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            actions: [{
              name: "cancel",
              text: "Cancel",
              type: "button",
              value: 'look|{"resetDescription":"true"}'
            }],
            attachment_type: "default",
            color: "#3AA3E3",
            fields: [],
            title: "What do you want to buy?"
          }]
        },
        description: "The location description."
      });
    });
  });

  describe('getEquipmentForSale()', () => {
    it('should build the description and options for buying equipment in a location', () => {
      command.info.type = 'weapons';
      character.location._shopEquipment = {
        'weapons': {
          shopText: __('Buy Guns'),
          shopDescription: __(" -- The shop description."),
          equipment: [
            'equipment-weapons-guns-023_s22',
            'equipment-weapons-guns-026_p25',
          ],
        }
      };
      character.weapon = Items.new('equipment-weapons-guns-023_s22');
      character.accessory = Items.new('equipment-accessories-000_no_accessory');
      character.level = 26;
      character.gold = 2500;

      const [description, attachments] = command.getEquipmentForSale(character, '', new Attachments().add({}));

      expect(description).toBe("\n\nYou review the equipment you can use:\n>- *S22 \"Justifier\"* _(1500g, Lv.23 ✗)_: --Equipped-- _(Ranged Attack)_\n>- *P25 \"Final Phrase\"* _(2000g, Lv.26 ✓)_: 14-19 Damage, 2-3 Attacks, 6 Ammo (+4) _(Ranged Attack)_");
      expect(attachments).toEqual({
        collection: [{
          actions: [{
            name: "equipment",
            options: [{
              text: 'S22 "Justifier" ✗',
              value: 'buy|{"action":"confirm","item":"equipment-weapons-guns-023_s22"}'
            }, {
              text: 'P25 "Final Phrase" ✓',
              value: 'buy|{"action":"confirm","item":"equipment-weapons-guns-026_p25"}'
            }],
            text: "Equipment",
            type: "select"
          }],
          attachment_type: "default"
        }]
      });
    });
  });

  describe('getSpellsForSale()', () => {
    it('should build the description and options for buying spells in a location', () => {
      command.info.type = 'simple';
      character.location._shopSpells = {
        'simple': {
          shopText: __('Learn Spells'),
          items: [
            'cure',
            'enfeeble',
            'icicle',
          ]
        }
      };
      character.knownSpells = ['cure'];
      character.gold = 200;
      character._spellPower = 10;

      const [description, attachments] = command.getSpellsForSale(character, '', new Attachments().add({}));

      expect(description).toBe("\n\nYou review the spells on offer:\n>- *Enfeeble (400g, 25MP):* Sap the living energy directly from your opponent, lowering both their attack and defence by 27% for 3 turns.\n>- *Icicle (100g, 5MP):* Spear an enemy with a blade of ice (10-15 damage). _(Chill Attack)_");
      expect(attachments).toEqual({
        collection: [{
          actions: [{
            name: "spells",
            options: [{
              text: "Enfeeble ✗",
              value: 'buy|{"action":"buy","spell":"enfeeble"}'
            }, {
              text: "Icicle ✓",
              value: 'buy|{"action":"buy","spell":"icicle"}'
            }],
            text: "Spells",
            type: "select"
          }],
          attachment_type: "default"
        }]
      });
    });
  });

  describe('getItemsForSale()', () => {
    it('should build the description and options for buying spells in a location', () => {
      command.info.type = 'provisions';
      character.location._shopItems = {
        'provisions': {
          shopText: __('Buy Provisions'),
          items: [
            'torch',
            'consumables-potion',
          ],
        },
      };

      character.gold = 2;

      const [description, attachments] = command.getItemsForSale(character, '', new Attachments().add({}));

      expect(description).toBe("\n\nYou review the items for sale:\n>- *Torch* _(1g)_: See in dark areas, revealing sneaky enemies and secrets.\n>- *Potion* _(5g)_: Recover +50 HP.");
      expect(attachments).toEqual({
        collection: [{
          actions: [{
            name: "items",
            options: [{
              text: "Torch ✓",
              value: 'buy|{"action":"quantity","item":"torch"}'
            }, {
              text: "Potion ✗",
              value: 'buy|{"action":"quantity","item":"consumables-potion"}'
            }],
            text: "Items",
            type: "select"
          }],
          attachment_type: "default"
        }]
      });
    });
  });

  describe('showConfirm()', () => {
    it('should display correct error messages', async () => {
      command.updateLast = jest.fn();

      command.info.item = 'equipment-weapons-guns-023_s22';
      character.weapon = Items.new('equipment-weapons-guns-023_s22');
      await command.showConfirm();
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            color: "warning",
            title: "You already own that!"
          }]
        },
        doLook: true
      });

      command.info.item = 'equipment-weapons-guns-026_p25';
      character.level = 5;
      await command.showConfirm();
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            color: "warning",
            title: "You're only level 5, and not high enough to equip that!"
          }]
        },
        doLook: true
      });

      command.info.item = 'equipment-weapons-guns-026_p25';
      character.level = 26;
      await command.showConfirm();
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            color: "warning",
            title: ":warning: You can't afford that."
          }]
        },
        doLook: true
      });
    });

    it('should display message with query to sell or keep old equipment', async () => {
      command.updateLast = jest.fn();

      command.info.item = 'equipment-weapons-guns-023_s22';
      character.weapon = Items.new('equipment-weapons-guns-026_p25');
      character.getFields = jest.fn(() => []);
      character.level = 25;
      character.gold = 5000;

      await command.showConfirm();
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            actions: [{
              name: "sell",
              text: "Sell",
              type: "button",
              value: 'buy|{"action":"buy","item":"equipment-weapons-guns-023_s22","confirm":"sell"}'
            }, {
              name: "keep",
              text: "Keep",
              type: "button",
              value: 'buy|{"action":"buy","item":"equipment-weapons-guns-023_s22","confirm":"keep"}'
            }, {
              name: "cancel",
              text: "Cancel",
              type: "button",
              value: 'look|{"resetDescription":"true"}'
            }],
            attachment_type: "default",
            color: "#3AA3E3",
            fields: []
          }]
        },
        description: "Fantastic choice.  And did you want to sell your old P25 \"Final Phrase\" for *200g* or keep it?"
      });
    });
  });

  describe('showQuantities()', () => {
    it('should show quantity buttons', async () => {
      command.updateLast = jest.fn();
      command.info.item = 'consumables-potion';
      character.getFields = jest.fn(() => []);

      await command.showQuantities();

      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            actions: [{
              name: "buy_1",
              style: "danger",
              text: "Buy 1",
              type: "button",
              value: 'buy|{"action":"buy","item":"consumables-potion","quantity":1}'
            }, {
              name: "buy_5",
              style: "danger",
              text: "Buy 5",
              type: "button",
              value: 'buy|{"action":"buy","item":"consumables-potion","quantity":5}'
            }, {
              name: "buy_10",
              style: "danger",
              text: "Buy 10",
              type: "button",
              value: 'buy|{"action":"buy","item":"consumables-potion","quantity":10}'
            }, {
              name: "buy_25",
              style: "danger",
              text: "Buy 25",
              type: "button",
              value: 'buy|{"action":"buy","item":"consumables-potion","quantity":25}'
            }, {
              name: "cancel",
              text: "Cancel",
              type: "button",
              value: 'look|{"resetDescription":"true"}'
            }],
            attachment_type: "default",
            fields: [],
            title: "How many do you want to buy?"
          }]
        }
      });
    });
  });

  describe('buy()', () => {
    it('should buy spells', async () => {
      command.updateLast = jest.fn();
      command.buySpell = jest.fn(() => ['spellcolor', 'spelltitle']);
      command.info.spell = 'spelltype';
      await command.buy();
      expect(command.buySpell).toHaveBeenCalledWith(character, 'spelltype');
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            color: "spellcolor",
            title: "spelltitle"
          }]
        },
        doLook: true,
        fields: []
      });
    });

    it('should buy equipment', async () => {
      command.updateLast = jest.fn();
      command.buyEquipment = jest.fn(() => ['equipcolor', 'equiptitle']);
      command.info.item = 'equipment-weapons-001_pine_club';
      const equipment = Items.new('equipment-weapons-001_pine_club');
      await command.buy();
      expect(command.buyEquipment).toHaveBeenCalledWith(character, equipment);
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            color: "equipcolor",
            title: "equiptitle"
          }]
        },
        doLook: true,
        fields: []
      });
    });

    it('should buy items', async () => {
      command.updateLast = jest.fn();
      command.buyItem = jest.fn(() => ['itemcolor', 'itemtitle']);
      command.info.item = 'consumables-potion';
      command.info.quantity = 5;
      const item = Items.new('consumables-potion');
      await command.buy();
      expect(command.buyItem).toHaveBeenCalledWith(character, item, 5);
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            color: "itemcolor",
            title: "itemtitle"
          }]
        },
        doLook: true,
        fields: []
      });
    });
  });

  describe('buySpell()', () => {
    it('should provide a warning if you can\'t afford the spell', () => {
      const [color, title] = command.buySpell(character, 'icicle');

      expect(color).toBe(COLORS.WARNING);
      expect(title).toBe(":warning: You can't afford that.");
    });

    it('should buy the spell', () => {
      character.gold = 300;

      const [color, title] = command.buySpell(character, 'icicle');

      expect(color).toBe(COLORS.GOOD);
      expect(title).toBe("You hand over 100g and after a few hours of study, you learn to cast Icicle!");
      expect(character.gold).toBe(200);
      expect(character.knownSpells).toEqual(['icicle']);
    });
  });

  describe('buyEquipment()', () => {
    it('should buy equipment and sell old equipment', () => {
      command.info.confirm = 'sell';
      character.slashbot = {};
      character.gold = 1000;
      character.weapon = Items.new('equipment-weapons-002_ash_club');
      character.level = 20;
      const equipment = Items.new('equipment-weapons-004_oak_club');
      equipment.doBuyActions = jest.fn();

      const [color, title] = command.buyEquipment(character, equipment);

      expect(color).toBe(COLORS.GOOD);
      expect(title).toBe("You sell your old Ash Club for 3g, and equip a brand-new Oak Club in its place.");
      expect(character.gold).toBe(953);
      expect(equipment.doBuyActions).toHaveBeenCalledWith(character, 1);
      expect(character.weapon.type).toBe('equipment-weapons-004_oak_club');
      expect(character.getStat(STATS.EQUIPMENT_SOLD, 'weapon')).toBe(1);
      expect(character.getStat(STATS.EQUIPMENT_PURCHASED, 'weapon')).toBe(1);
    });

    it('should buy equipment and keep old equipment', () => {
      command.info.confirm = 'keep';
      character.slashbot = {};
      character.gold = 1000;
      character.weapon = Items.new('equipment-weapons-002_ash_club');
      character.level = 20;
      const equipment = Items.new('equipment-weapons-004_oak_club');
      equipment.doBuyActions = jest.fn();

      const [color, title] = command.buyEquipment(character, equipment);

      expect(color).toBe(COLORS.GOOD);
      expect(title).toBe("You buy and equip a brand-new Oak Club, tucking your Ash Club away for later.");
      expect(character.gold).toBe(950);
      expect(equipment.doBuyActions).toHaveBeenCalledWith(character, 1);
      expect(character.weapon.type).toBe('equipment-weapons-004_oak_club');
      expect(character.getStat(STATS.EQUIPMENT_SOLD, 'weapon')).toBe(0);
      expect(character.getStat(STATS.EQUIPMENT_PURCHASED, 'weapon')).toBe(1);
      expect(character.equipment.has('equipment-weapons-002_ash_club', 'weapon')).toBe(true);
    });
  });

  describe('buyItem()', () => {
    it('should provide a warning when purchase would go over max inventory quantity', () => {
      const item = Items.new('reputation-doublehead_coin');
      const [color, title] = command.buyItem(character, item, 10);

      expect(color).toBe(COLORS.WARNING);
      expect(title).toBe(":warning: You cannot have more than 1x Doublehead Coin.");
    });

    it('should provide a warning when character can\'t afford', () => {
      const item = Items.new('torch');
      const [color, title] = command.buyItem(character, item, 10);

      expect(color).toBe(COLORS.WARNING);
      expect(title).toBe(":warning: You cannot afford 10x Torch.");
    });

    it('should buy item', () => {
      character.gold = 1000;
      character.slashbot = {};
      const item = Items.new('torch');
      item.doBuyActions = jest.fn();
      const [color, title] = command.buyItem(character, item, 10);

      expect(color).toBe(COLORS.GOOD);
      expect(title).toBe("You plunk down the asking price and collect your Torch x10.");
      expect(character.gold).toBe(990);
      expect(character.inventory.has('torch', 10)).toBe(true);
      expect(item.doBuyActions).toHaveBeenCalledWith(character, 10);
    });
  });
});