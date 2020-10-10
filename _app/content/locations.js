"use strict";

let collection = {};
let names      = {};
let types      = new Map();

const { Enemies }              = require('@app/content/enemies');
const { Actions, Attachments } = require('slacksimple');
const Random                   = require('@util/random');
const Files                    = require('@util/files');
const Content                  = require('@app/content')(collection, names, types);
const { Loot }                 = require('@app/loot');
const Num                      = require('@util/num');
const { isEvent, isChristmas } = require('@util/events');

const STATS           = require('@constants').STATS;
const FLAGS           = require('@constants').FLAGS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

/**
 * Base location class.
 */
class Location {
  constructor(info) {
    this.type                  = _.get(info, 'type', '');
    this._displayName          = _.get(info, 'displayName', '');
    this.buttonText            = _.get(info, 'buttonText', false);
    this.aliases               = _.get(info, 'aliases', []);
    this._description          = _.get(info, 'description', '');
    this.image                 = _.get(info, 'image', '');
    this.encounters            = _.get(info, 'encounters', []);
    this.enemies               = _.get(info, 'enemies', []);
    this._connectedLocations   = _.get(info, 'connectedLocations', []);
    this._shopEquipment        = _.get(info, 'shopEquipment', {});
    this._shopItems            = _.get(info, 'shopItems', {});
    this._shopSpells           = _.get(info, 'shopSpells', {});
    this._shopPets             = _.get(info, 'shopPets', []);
    this.shopPetsButton        = _.get(info, 'shopPetsButton', "Buy Pets");
    this.shopPetsStyle         = _.get(info, 'shopPetsStyle', 'default');
    this.shopText              = _.get(info, 'shopText', '');
    this.light                 = _.get(info, 'light', 100);
    this.maxLevel              = _.get(info, 'maxLevel', 1);
    this.flasks                = _.get(info, 'flasks', []);
    this.flaskText             = _.get(info, 'flaskText', '');
    this.travelCost            = _.get(info, 'travelCost', 0);
    this.itemCostMultiplier    = _.get(info, 'itemCostMultiplier', 1);
    this.equipCostMultiplier   = _.get(info, 'equipCostMultiplier', 1);
    this.spellCostMultiplier   = _.get(info, 'spellCostMultiplier', 1);
    this.hasMysteriousMerchant = _.get(info, 'hasMysteriousMerchant', false);
    this.hasHolidayDrakes      = _.get(info, 'hasHolidayDrakes', false);
  }

  /**
   * Load any extra information required to display this location.
   *
   * @param {Character} character - The character to load extra information for.
   */
  async loadExtra(character) { }

  /**
   * Gets all the names this location can go by, including aliases.
   *
   * @return {array} The list of names.
   */
  get allNames() {
    return this.aliases.concat(this._displayName);
  }

  /**
   * Get the display name of this location.
   *
   * @param {Character} character - The character to display the name to.
   *
   * @return {string}
   */
  getDisplayName(character) {
    return this._displayName;
  }

  /**
   * Get any warning needed when teleporting away from this location.
   *
   * @param {Character} character - The character doing the teleporting.
   *
   * @return {string}
   */
  getTeleportWarning(character) {
    return "";
  }

  /**
   * Get the text to display for actions in this location.
   *
   * @param {Character} character - The character looking.
   *
   * @return {string}
   */
  getLookTitle(character) {
    return "Points of interest:";
  }

  /**
   * Get the light level in the current location.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {integer}
   */
  getLight(character) {
    return this.light;
  }

  /**
   * Get the professions that the character can change to at this location.
   *
   * @param {Character} character - The character looking to change professions.
   *
   * @return {array}
   */
  getAvailableProfessions(character) {
    return [];
  }

  /**
   * Gets the loot an enemy drops in this location.
   *
   * @param {Character} character - The character getting the loot.
   * @param {Enemy} enemy - The enemy dropping the loot.
   *
   * @return object
   */
  getLoot(character, enemy) {
    return enemy.getLoot(character);
  }

  /**
   * Get the loot contained in a Cursed Chest in this location.
   *
   * @param {Character} character - The character looting the Cursed Chest.
   *
   * @return {Loot}
   */
  getCursedChestLoot(character) {
    return new Loot();
  }

  /**
   * Get the text for this location to display on the travel button.
   *
   * @param {Character} character - The character travelling.
   *
   * @return {string}
   */
  getButtonText(character) {
    let text = this.buttonText ? this.buttonText : this.getDisplayName(character);

    if (this.travelCost) {
      text += ` [${this.travelCost} AP]`;
    }

    return text;
  }

  /**
   * Perform any actions that need to happen at the start of a fight turn.
   *
   * @param {Character} character - The character in the fight.
   * @param {array} messages - Messages to add to.
   *
   * @return {array}
   */
  doFightTurnStart(character, messages) {
    return messages;
  }

  /**
   * Perform any actions that need to happen at the end of a fight turn.
   *
   * @param {Character} character - The character in the fight.
   * @param {array} messages - Messages to add to.
   *
   * @return {array}
   */
  doFightTurnEnd(character, messages) {
    return messages;
  }

  /**
   * Perform wrap-up tasks that have to happen before stats, etc are affected.
   *
   * @param {Character} character - The character involved in the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightWrapUp(character, messages) {
    return messages;
  }

  /**
   * Perform any post-fight actions that always happen.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(character, messages) {
    return messages;
  }

  /**
   * Perform any post-fight success actions and return the messages arising from them.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    return messages;
  }

  /**
   * Perform any post-fight failure actions and return the messages arising from them.
   *
   * @param {Character} character - The character who lost the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightFailure(character, messages) {
    return messages;
  }

  /**
   * Add actions for buying flasks, if they are sold at this location.
   *
   * @param {Character} character - The character buying the flasks.
   * @param {Actions} actions - The actions array to add to.
   *
   * @return {Actions}
   */
  addFlaskActions(character, actions) {
    if (this.flasks.length) {
      actions.addButton(this.flaskText, "flasks");
    }

    return actions;
  }

  /**
   * If the character has encounters available at this location, add Explore actions.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {Actions}
   */
  addExploreActions(character, actions) {
    if (this.getEncounters(character).length > 0) {
      const style = character.ap > 0 ? 'default' : 'danger';
      actions.addButton("Explore (1 AP)", "explore", { style });
      actions.addButton("Rest", "rest");
    }

    return actions;
  }

  /**
   * Add a buy action button for this location.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {array}
   */
  addBuyActions(character, actions) {
    let addSellAction = false;

    if (this.hasShopEquipment(character)) {
      actions = this.addBuyActionsFromItems(actions, this.getShopEquipment(character));
      addSellAction = true;
    }

    if (this.hasShopItems(character)) {
      actions = this.addBuyActionsFromItems(actions, this.getShopItems(character));
      addSellAction = true;
    }

    if (this.hasShopSpells(character)) {
      actions = this.addBuyActionsFromItems(actions, this.getShopSpells(character));
      addSellAction = true;
    }

    if (addSellAction && character.equipment.list().length) {
      actions.addButton("Sell Equipment", "sell");
    }

    if (this.hasShopPets(character)) {
      const style = this.shopPetsStyle;
      actions.addButton(this.shopPetsButton, 'pets', { style, params: { action: "buy", step: "list" } });
      actions.addButton("Change Pet", 'pets', { params: { action: "change", step: "list" } });
    }

    return actions;
  }

  /**
   * Add buy actions from the provided items.
   *
   * @param {Actions} actions - The Actions to add to.
   * @param {object} items - The items to make buy actions for.
   *
   * @return {Actions}
   */
  addBuyActionsFromItems(actions, items) {
    for (const [type, details] of Object.entries(items)) {
      const style = _.get(details, 'style', 'default');
      actions.addButton(details.shopText, 'buy', { style, params: { action: "list", type } });
    }

    return actions;
  }

  /**
   * Display misc action buttons for this location.
   *
   * @param {Character} character - The character at this location.
   * @param {Actions} actions - The Actions collection to add to.
   *
   * @return {array}
   */
  addMiscActions(character, actions) {
    if (this.hasMysteriousMerchant && isEvent()) {
      actions.addButton("Mysterious Merchant", "start_encounter", { params: { type: 'event-mysterious_merchant' }, style: 'primary' });
    }

    if (this.hasHolidayDrakes && isChristmas()) {
      actions.addButton("Holiday Drakes", "start_encounter", { params: { type: 'event-holiday_drakes' }, style: 'primary' });
    }

    return actions;
  }

  /**
   * Get the actions for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting actions.
   * @param {Actions} actions - A collection of actions, useful if a subclass wants to add their actions first.
   *
   * @return {array}
   */
  getActions(character, actions = false) {
    actions = actions ? actions : new Actions();
    actions = this.addFlaskActions(character, actions);
    actions = this.addExploreActions(character, actions);
    actions = this.addBuyActions(character, actions);
    actions = this.addMiscActions(character, actions);

    return actions;
  }

  /**
   * Get the description for this location and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    return this._description;
  }

  /**
   * Get any extra description for the shop type the user is looking at.
   *
   * @param {Character} character - The character doing the shopping.
   * @param {string} shopType - The type of shop the character is shopping at.
   *
   * @return {string}
   */
  getShopDescription(character, shopType) {
    const equipDetails = _.get(this.getShopEquipment(character), shopType, false);
    if (equipDetails) {
      return _.get(equipDetails, 'shopDescription', '');
    }

    const itemDetails  = _.get(this.getShopItems(character), shopType, false);
    if (itemDetails) {
      return _.get(itemDetails, 'shopDescription', '');
    }

    const spellDetails = _.get(this.getShopSpells(character), shopType, false);
    if (spellDetails) {
      return _.get(spellDetails, 'shopDescription', '');
    }

    return '';
  }

  /**
   * Decide if this shop has equipment for the current character.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {boolean}
   */
  hasShopEquipment(character) {
    for (const [, details] of Object.entries(this.getShopEquipment(character))) {
      if (_.get(details, 'equipment', []).length) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the equipment sold by this shop.
   * Can be overridden on a per-character basis.
   *
   * @param {Character} character - The Character doing the buying.
   *
   * @return {object}
   */
  getShopEquipment(character) {
    return this._shopEquipment;
  }

  /**
   * Get the equipment this location sells, that the character can use.
   *
   * @param {Character} character - The character doing the buying.
   * @param {string} shopType - The sub-type of shop to get equipment for.
   *
   * @return {array}
   */
  getShopEquipmentByType(character, shopType) {
    const details = _.get(this.getShopEquipment(character), shopType, false);

    return details ? _.get(details, 'equipment', []) : [];
  }

  /**
   * Decide if this shop has items for the current character.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {boolean}
   */
  hasShopItems(character) {
    return ! _.isEmpty(this.getShopItems(character));
  }

  /**
   * Get all the items this location sells.
   *
   * @param {Character} character - The character buying items.
   *
   * @return {object}
   */
  getShopItems(character) {
    if (this.hasMysteriousMerchant && isEvent()) {
      return {
        'provisions': {
          shopText: __('Buy Provisions'),
          items: [
            'consumables-potion',
            'consumables-elixir',
            'consumables-smelling_salts',
          ],
        },
        'premium': {
          shopText: __('Premium Goods'),
          style: 'primary',
          items: [
            'consumables-ambrosia',
            'blessed_key',
            'boost-max_ap'
          ],
        },
      };
    }

    return this._shopItems;
  }

  /**
   * Get the items of a specific type this location sells.
   *
   * @param {Character} character - The character doing the buying.
   * @param {string} type - The type of items being sold.
   *
   * @return {array}
   */
  getShopItemsByType(character, type) {
    return _.get(this.getShopItems(character), type, {items: []}).items;
  }

  /**
   * If this location sells spells.
   *
   * @param {Character} character - The character at this location.
   *
   * @return {boolean}
   */
  hasShopSpells(character) {
    return ! _.isEmpty(this.getShopSpells(character));
  }

  /**
   * Get all the spells this location sells.
   *
   * @param {Character} character - The character at this location.
   *
   * @return {object}
   */
  getShopSpells(character) {
    return this._shopSpells;
  }

  /**
   * Get all the spells of a specific type this location sells.
   *
   * @param {Character} character - The character at this location.
   * @param {string} type - The type of spells being sold.
   *
   * @return {array}
   */
  getShopSpellsByType(character, type) {
    return _.get(this.getShopSpells(character), type, { items: [] }).items;
  }

  /**
   * Decide if this shop has pets for the current character.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {boolean}
   */
  hasShopPets(character) {
    return this.getShopPets(character).length > 0;
  }

  /**
   * Get the pets this shop sells.
   *
   * @param {Character} character - The character doing the buying.
   *
   * @return {array}
   */
  getShopPets(character) {
    if (this.hasMysteriousMerchant && isEvent()) {
      return [
        'equipment-pets-aisling',
        'equipment-pets-mikey',
      ];
    }

    return this._shopPets;
  }

  /**
   * Decide if this shop has any pets the current character does not own yet.
   *
   * @param {Character} character - The character to check.
   * @param {PetsOwned} petsOwned - The pets this character owns.
   *
   * @return {boolean}
   */
  hasUnownedShopPets(character, petsOwned) {
    return this.getUnownedShopPets(character, petsOwned).length > 0;
  }

  /**
   * Get all the pets this shop has that this character does not own.
   *
   * @param {Character} character - The character to check against.
   * @param {PetsOwned} petsOwned - The pets this character owns.
   *
   * @return {array}
   */
  getUnownedShopPets(character, petsOwned) {
    return this.getShopPets(character).filter(function(value) {
      return ! _.map(petsOwned.owned, 'type').includes(value);
    });
  }

  /**
   * Get the locations connected to this location.  Allows for custom logic on a per-location, per-character basis.
   *
   * @param {Character} character - The character looking at connected locations.
   *
   * @return {array}
   */
  getConnectedLocations(character) {
    return this._connectedLocations;
  }

  /**
   * Check to see if you can travel to the specified location from here.
   *
   * @param {string} travelType - The type of the location to attempt to travel to.
   * @param {Character} character - The character doing the travelling, if there's custom logic for this location.
   *
   * @return {boolean}
   */
  canTravelTo(travelType, character) {
    let location = Locations.new(travelType);
    if (location.travelCost) {
      return character.ap >= location.travelCost;
    }

    return this.getConnectedLocations(character).includes(travelType);
  }

  /**
   * Get the message that explains why a character would not be able to travel to a location.
   *
   * @param {string} travelType - The location being travelled to.
   * @param {Character} character - The character travelling.
   *
   * @return {string}
   */
  getTravelErrorMessage(travelType, character) {
    let location = Locations.new(travelType);
    if (location.travelCost && character.ap < location.travelCost) {
      return ":warning: You do not have enough AP to travel there.";
    }

    return ":warning: You cannot get there from here.";
  }

  /**
   * Executed when a character travels to this location.
   *
   * @param {Character} character - The character doing the travelling.
   *
   * @return {string}
   */
  async onTravelTo(character) {
    await this.loadExtra(character);

    return "";
  }

  /**
   * Add Cursed Chest encounter, if applicable in current area.
   *
   * @param {Character} character - The character to add the chest for.
   * @param {array} encounters - The encounters to add to.
   *
   * @return {array}
   */
  addCursedChestEncounter(character, encounters) {
    if (this.shouldAddCursedChest(character)) {
      let totalWeight = 0;
      for (let encounter of encounters) {
        encounter.weight *= 100;
        totalWeight += encounter.weight;
      }

      const chestWeight = this.getChestWeight(character, totalWeight);
      encounters.push({ value: 'cursed_chest', weight: chestWeight });
    }

    character.incrementFlag(FLAGS.CHEST_CURSE_FIGHTS);

    return encounters;
  }

  /**
   * If we should even add the Cursed Chest.
   * Should be extended in children to take into account bosses, but should call super all the
   * time to check against the flag, to prevent it from happening too often.
   *
   * @param {Character} character - The character to add the chest for.
   *
   * @return boolean
   */
  shouldAddCursedChest(character) {
    return true;
  }

  /**
   * Get the chance of encountering a cursed chest, as a weight balanced against the total weight.
   *
   * @param {Character} character - The character to get the weight for.
   * @param {integer} totalWeight - The total weight of all encounters here so far.
   *
   * @return {integer}
   */
  getChestWeight(character, totalWeight) {
    // Get number of fights since chest was last found to determine % chance of finding one
    const fightTurns = character.getFlag(FLAGS.CHEST_CURSE_FIGHTS);

    let chestChance = 0;

    if (fightTurns <= 50) {
      chestChance = 0;
    }
    else if (fightTurns <= 75) {
      chestChance = 0.01;
    }
    else if (fightTurns <= 80) {
      chestChance = 0.02;
    }
    else if (fightTurns <= 85) {
      chestChance = 0.04;
    }
    else if (fightTurns <= 90) {
      chestChance = 0.06;
    }
    else if (fightTurns <= 95) {
      chestChance = 0.08;
    }
    else {
      chestChance = 0.1;
    }

    // If character has bought, but not yet used, a Blessed Key, ensure at least a 5% chance
    if (this.shouldGetFirstKeyBonus(character)) {
      chestChance = Math.max(chestChance, 0.05);
    }

    return Num.getIncreaseForPercentage(totalWeight, chestChance);
  }

  /**
   * If the provided character has bought, but not yet used, their first Blessed Key.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  shouldGetFirstKeyBonus(character) {
    // Failsafe to prevent someone from taking advantage of this bonus
    if (character.hasStat(STATS.CURSED_CHEST, { value: 3 })) {
      return false;
    }

    return character.inventory.has('blessed_key') && ! character.hasStat(STATS.CURSED_CHEST, { subType: 'blessed_key'});
  }

  /**
   * Choose an encounter to happen to this character when starting a fight.
   *
   * @param {Character} character - The character starting the fight.
   * @param {object} message - The message that was passed to slashbot.
   */
  chooseEncounter(character, message) {
    let title;
    let encounters = this.getEncounters(character);
    encounters = this.addCursedChestEncounter(character, encounters);
    encounters = this.modifyEncounters(character, encounters);

    const encounterType = Random.getWeighted(encounters);

    if (encounterType === 'fight') {
      title = this.chooseEnemy(character, message);
    }
    else {
      const Encounters    = require('@app/content/encounters').Encounters;
      character.encounter = Encounters.new(encounterType);
      character.state     = CHARACTER_STATE.ENCOUNTER;
      title               = ":diamond_shape_with_a_dot_inside: You happened upon something interesting!";
    }

    // Update old message with encounter
    character.slashbot.update(
      message,
      message.text,
      character,
      Attachments.one({ title })
    );
  }

  /**
   * Choose an enemy to fight.
   *
   * @param {Character} character - The character starting the fight.
   * @param {object} message - The message that was passed to slashbot.
   */
  chooseEnemy(character, message) {
    character.enemy = this.buildEnemy(character, this.pickRandomEnemy(character));
    character.state = CHARACTER_STATE.FIGHTING;

    if ('true' === _.get(process.env, 'GG_EZ', 'false')) {
      character.enemy.hp = 1;
    }

    const encounterName = character.enemy.getEncounterName(character);

    return `:white_check_mark: You encountered ${encounterName}.`;
  }

  /**
   * Pick a random enemy type from the list of enemies this location has.
   *
   * @param {Character} character - The character fighting an enemy.
   *
   * @return {string}
   */
  pickRandomEnemy(character) {
    let enemies = this.getEnemies(character);
    enemies = this.addSpecialEnemies(character, enemies);

    return Random.getWeighted(enemies);
  }

  /**
   * Build an enemy for the character to fight.
   *
   * @param {Character} character - The character to build the enemy for.
   * @param {string} type - The type of enemy to build.
   *
   * @return {Enemy}
   */
  buildEnemy(character, type) {
    let enemy = Enemies.new(type);
    const enemyLevel = this.getEnemyLevel(enemy, character);
    const levelBonus = this.getEnemyLevelBonus(enemy, character, enemy.type);
    enemy.setLevel(enemyLevel, levelBonus);

    return enemy;
  }

  /**
   * Set the enemy level based on the character's level, with a maximum of 26, 36, or 46,
   * based on the number of Watermoon dragons killed.
   *
   * @param {Enemy} enemy - The enemy to get the level for.
   * @param {Character} character - The character in this location.
   *
   * @return {integer}
   */
  getEnemyLevel(enemy, character) {
    return Math.min(character.level, this.maxLevel);
  }

  /**
   * Get a location-based level bonus.
   *
   * @param {Enemy} enemy - The enemy to get the level bonus for.
   * @param {Character} character - The character in this location.
   * @param {string} type - The type of the enemy to check.
   *
   * @return {integer}
   */
  getEnemyLevelBonus(enemy, character, type) {
    return 0;
  }

  /**
   * Populate enemy choices to randomly draw from.
   * This can be overridden in specific locations to add/remove enemies from the population based
   * on the character.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEnemies(character) {
    return this.enemies;
  }

  /**
   * Add any special enemies that might be added by events, etc.
   *
   * @param {Character} character - The character in this location.
   * @param {array} enemies - The normal enemies in this area.
   *
   * @return {array}
   */
  addSpecialEnemies(character, enemies) {
    return enemies;
  }

  /**
   * Populate encounter choices to randomly draw from.
   * This can be overridden in specific locations to add/remove encounters from the population
   * base on the character.
   *
   * @param {Character} character - The character in this location.
   *
   * @return {array}
   */
  getEncounters(character) {
    return this.encounters;
  }

  /**
   * Modify the base location's encounters.
   *
   * @param {Character} character - The character to modify the encounters for.
   * @param {array} encounters - The encounters to modify.
   *
   * @return {array}
   */
  modifyEncounters(character, encounters) {
    return encounters;
  }
}

/**
 * Utility class for searching and creating new location objects.
 */
class Locations extends Content {}

module.exports = {
  Location,
  Locations
};

/**
 * @type array The collection of locations.
 */
Files.loadContent(`${CONTENT_FILES_PATH}/locations/`, `${CONTENT_FILES_PATH}/locations/`, collection);

/**
 * @type object The names of the locations, for quick reference.
 */
Files.getNames(collection, names);

/**
 * @type objec The types of the locations, keyed by name, for quick reference.
 */
Files.getTypes(collection, types);
