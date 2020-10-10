/*eslint-env mocha */
"use strict";

const Location  = require('@app/content/locations').Location;
const Character = require('@app/character').Character;
const Actions   = require('slacksimple').Actions;
const Enemy     = require('@app/content/enemies').Enemy;

const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const weaponShop = new Location({
  shopEquipment: {
    'weapons': {
      shopText: __('Buy Weapons'),
      equipment: [
        'equipment-weapons-001_pine_club',
        'equipment-weapons-002_ash_club',
        'equipment-weapons-004_oak_club',
        'equipment-weapons-006_ironwood_club',
      ],
    },
  },
});

const itemShop = new Location({
  shopItems: {
    'potions': {
      shopText: __('Buy Items'),
      items: [
        'consumables-potion',
        'consumables-elixir',
      ]
    }
  }
});

const spellShop = new Location({
  shopSpells: {
    'simple': {
      shopText: __('Learn Spells'),
      items: [
        'scry',
        'icicle',
      ]
    }
  }
});

const petShop = new Location({
  shopPets: [
    'equipment-pets-midnight',
    'equipment-pets-lancelot',
    'equipment-pets-rory',
  ],
});

// -- Tests ----------------------------------------------------------------------------------------

describe('Location', () => {
  let location;

  beforeEach(() => {
    location = new Location({
      displayName: 'displayName',
      description: 'description',
    });
  });

  describe('get allNames()', () => {
    it('should return all names', () => {
      expect(location.allNames).toEqual(['displayName']);
    });
  });

  describe('getLight()', () => {
    it('should return the light at this location', () => {
      expect(location.getLight()).toBe(100);
    });
  });

  describe('getButtonText()', () => {
    it('should display correct text', () => {
      expect(location.getButtonText()).toBe('displayName');

      location.buttonText = 'buttonText';
      expect(location.getButtonText()).toBe('buttonText');

      location.travelCost = 2;
      expect(location.getButtonText()).toBe('buttonText [2 AP]');
    });
  });

  describe('addExploreActions()', () => {
    let actions, character;

    beforeEach(() => {
      actions = new Actions();
      character = { location };
    });

    it('should have no buttons by default', () => {
      location.getEncounters = jest.fn(() => []);
      expect(location.addExploreActions(character, actions)).toBe(actions);
    });

    it('should display explore buttons when there are encounters', () => {
      location.getEncounters = jest.fn(() => [{ value: 'fight', weight: 1 }]);
      expect(location.addExploreActions(character, actions).getCollection()).toEqual([{
        name: "explore_1_ap",
        style: "danger",
        text: "Explore (1 AP)",
        type: "button",
        value: "explore|{}"
      }, {
        name: "rest",
        text: "Rest",
        type: "button",
        value: "rest|{}"
      }]);
    });
  });

  describe('addBuyActions()', () => {
    let actions, character;

    beforeEach(() => {
      actions   = new Actions();
      character = {
        location,
        equipment: {
          list: () => []
        }
      };
    });

    it('should have no buttons by default', () => {
      expect(location.addBuyActions(character, actions).getCollection()).toEqual([]);
    });

    it('should have equipment buttons', () => {
      expect(weaponShop.addBuyActions(character, actions).getCollection()).toEqual([{
        name: "buy_weapons",
        text: "Buy Weapons",
        style: "default",
        type: "button",
        value: 'buy|{"action":"list","type":"weapons"}'
      }]);
    });

    it('should have item buttons', () => {
      expect(itemShop.addBuyActions(character, actions).getCollection()).toEqual([{
        name: "buy_items",
        style: "default",
        text: "Buy Items",
        type: "button",
        value: 'buy|{"action":"list","type":"potions"}'
      }]);
    });

    it('should have spell buttons', () => {
      expect(spellShop.addBuyActions(character, actions).getCollection()).toEqual([{
        name: "learn_spells",
        style: "default",
        text: "Learn Spells",
        type: "button",
        value: 'buy|{"action":"list","type":"simple"}'
      }]);
    });

    it('should have pet buttons', () => {
      expect(petShop.addBuyActions(character, actions).getCollection()).toEqual([{
        name: "buy_pets",
        style: "default",
        text: "Buy Pets",
        type: "button",
        value: 'pets|{"action":"buy","step":"list"}'
      }, {
        name: "change_pet",
        text: "Change Pet",
        type: "button",
        value: 'pets|{"action":"change","step":"list"}'
      }]);
    });
  });

  describe('addBuyActions()', () => {
    let actions;

    beforeEach(() => {
      actions = new Actions();
    });

    it('should do nothing with no collection', () => {
      expect(location.addBuyActions({}, actions)).toEqual({ collection: [] });
    });
  });

  describe('addMiscActions()', () => {
    it('should do nothing by default', () => {
      let actions = new Actions();
      expect(location.addMiscActions({ location }, actions).getCollection()).toEqual([]);
    });
  });

  describe('getActions()', () => {
    let actions, character;

    beforeEach(() => {
      actions = new Actions();
      character = { location };
    });

    it('should return no buttons by default', () => {
      location.getEncounters = jest.fn(() => []);
      expect(location.getActions(character, actions).getCollection()).toEqual([]);
    });
  });

  describe('getDescription()', () => {
    it('should return the description', () => {
      expect(location.getDescription()).toBe('description');
    });
  });

  describe('hasShopEquipment()', () => {
    it('should return true when does have equipment', () => {
      expect(weaponShop.hasShopEquipment({})).toBe(true);
    });

    it('should return false when does not have equipment', () => {
      expect(location.hasShopEquipment({})).toBe(false);
    });
  });

  describe('getShopEquipment()', () => {
    it('should return the shop equipment', () => {
      expect(weaponShop.getShopEquipment()).toEqual({
        weapons: {
          equipment: [
            "equipment-weapons-001_pine_club",
            "equipment-weapons-002_ash_club",
            "equipment-weapons-004_oak_club",
            "equipment-weapons-006_ironwood_club"
          ],
          shopText: "Buy Weapons"
        }
      });
    });
  });

  describe('getShopEquipmentByType()', () => {
    it('should get equipment when there is any of the provided type', () => {
      expect(weaponShop.getShopEquipmentByType({}, 'weapons')).toEqual([
        "equipment-weapons-001_pine_club",
        "equipment-weapons-002_ash_club",
        "equipment-weapons-004_oak_club",
        "equipment-weapons-006_ironwood_club"
      ]);
    });

    it('should return nothing when there is no equipment of the provided type', () => {
      expect(location.getShopEquipmentByType({}, 'blarp')).toEqual([]);
    });
  });

  describe('hasShopItems()', () => {
    it('should return true when does have items', () => {
      expect(itemShop.hasShopItems({})).toBe(true);
    });

    it('should return false when does not have items', () => {
      expect(location.hasShopItems({})).toBe(false);
    });
  });

  describe('getShopItems()', () => {
    it('should return the shop items', () => {
      expect(itemShop.getShopItems()).toEqual({
        potions: {
          items: [
            "consumables-potion",
            "consumables-elixir"
          ],
          shopText: "Buy Items"
        }
      });
    });
  });

  describe('getShopItemsByType()', () => {
    it('should return items when there is any of the provided type', () => {
      expect(itemShop.getShopItemsByType({}, 'potions')).toEqual([
        "consumables-potion",
        "consumables-elixir"
      ]);
    });

    it('should return nothing when there are no items of the provided type', () => {
      expect(itemShop.getShopItemsByType({}, 'bleppo')).toEqual([]);
    });
  });

  describe('hasShopSpells()', () => {
    it('should return true when does have spells', () => {
      expect(spellShop.hasShopSpells({})).toBe(true);
    });

    it('should return false when does not have spells', () => {
      expect(location.hasShopSpells({})).toBe(false);
    });
  });

  describe('getShopSpells()', () => {
    it('should return shop spells', () => {
      expect(spellShop.getShopSpells()).toEqual({
        simple: {
          items: ["scry", "icicle"],
          shopText: "Learn Spells"
        }
      });
    });
  });

  describe('getShopSpellsByType()', () => {
    it('should return spells when there is any of the provided type', () => {
      expect(spellShop.getShopSpellsByType({}, 'simple')).toEqual(["scry", "icicle"]);
    });
    it('should return nothing when there are no spells of the provided type', () => {
      expect(spellShop.getShopSpellsByType({}, 'honk')).toEqual([]);
    });
  });

  describe('hasShopPets()', () => {
    it('should return true when shop does have pets', () => {
      expect(petShop.hasShopPets({})).toBe(true);
    });

    it('should return false when shop does not have any pets', () => {
      expect(location.hasShopPets({})).toBe(false);
    });
  });

  describe('getShopPets()', () => {
    it('should return the pets the shop has', () => {
      expect(petShop.getShopPets()).toEqual(["equipment-pets-midnight", "equipment-pets-lancelot", "equipment-pets-rory"]);
    });
  });

  describe('hasUnownedShopPets()', () => {
    it('should follow simple boolean logic, honestly', () => {
      location.getUnownedShopPets = jest.fn(() => ['abc']);
      expect(location.hasUnownedShopPets()).toBe(true);
    });
  });

  describe('getUnownedShopPets()', () => {
    it('should filter out owned pets', () => {
      expect(petShop.getUnownedShopPets({}, { owned: [{ type: "equipment-pets-midnight" }] })).toEqual([
        "equipment-pets-lancelot",
        "equipment-pets-rory"
      ]);
    });
  });

  describe('getConnectedLocations()', () => {
    it('should return the connected locations', () => {
      location._connectedLocations = ['tyrose', 'tyrose-forest'];
      expect(location.getConnectedLocations()).toEqual(['tyrose', 'tyrose-forest']);
    });
  });

  describe('canTravelTo()', () => {
    it('should indicate you can travel to connected locations', () => {
      location._connectedLocations = ['tyrose', 'tyrose-forest'];
      expect(location.canTravelTo('tyrose', {})).toBe(true);
    });

    it('should indicate you cannot travel to locations that are not connected', () => {
      location._connectedLocations = ['tyrose', 'tyrose-forest'];
      expect(location.canTravelTo('tyrose-forest-cave', {})).toBe(false);
    });

    it('should prevent you from traveling without enough AP', () => {
      let character = new Character();
      character.setValues({ ap: 0 });
      character.location = new Location({
        connectedLocations: ['stagecoach']
      });

      expect(character.location.canTravelTo("stagecoach", character)).toBe(false);
    });
  });

  describe('shouldGetFirstKeyBonus()', () => {
    it('should correctly provide bonus', () => {
      let character = new Character();
      character.setValues();

      // By default, no
      expect(character.location.shouldGetFirstKeyBonus(character)).toBe(false);

      // First blessed key bought
      character.inventory.add('blessed_key', 1);
      expect(character.location.shouldGetFirstKeyBonus(character)).toBe(true);

      // Already used a blessed key
      character.setStat(STATS.CURSED_CHEST, 1, 'blessed_key');
      expect(character.location.shouldGetFirstKeyBonus(character)).toBe(false);

      // Check failsafe
      character = new Character();
      character.setValues();
      character.inventory.add('blessed_key', 1);
      character.setStat(STATS.CURSED_CHEST, 3);
      expect(character.location.shouldGetFirstKeyBonus(character)).toBe(false);
    });
  });


  describe('chooseEnemy()', () => {
    it('should create an enemy for the character to fight', () => {
      let character = (new Character()).setValues({});
      character.location = location;
      location.pickRandomEnemy = jest.fn(() => 'tyrose-forest-01-badger');

      expect(location.chooseEnemy(character, [])).toBe(":white_check_mark: You encountered a L1 Badger.");
      expect(character.enemy instanceof Enemy).toBe(true);
      expect(character.state).toBe(CHARACTER_STATE.FIGHTING);
    });
  });

  describe('buildEnemy()', () => {
    it('should build the requested enemy', () => {
      let character = (new Character()).setValues({});
      character.location = location;

      const enemy = location.buildEnemy(character, 'tyrose-forest-01-badger');
      expect(enemy.type).toBe('tyrose-forest-01-badger');
      expect(enemy.level).toBe(1);
      expect(enemy.getLevelBonus()).toBe(0);
    });
  });

  describe('getTravelErrorMessage()', () => {
    it('should display the correct error message', () => {
      let character = new Character();
      character.setValues();
      character.location = new Location();

      expect(character.getTravelErrorMessage("tyrose-forest", character)).toBe(
        ":warning: You cannot get there from here."
      );

      character.ap = 0;
      expect(character.getTravelErrorMessage("stagecoach", character)).toBe(
        ":warning: You do not have enough AP to travel there."
      );
    });
  });
});