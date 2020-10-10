"use strict";

const { Encounter }                       = require('@app/content/encounters');
const { Items }                           = require('@app/content/items');
const { Actions, Attachments }            = require('slacksimple');
const { getWeighted, fromArray, between } = require('@util/random');
const { listify, pluralize }              = require('@util/text');
const { get }                             = require('lodash');
const moment                              = require('moment');

const { CHARACTER_STATE } = require('@constants');

const ENCOUNTER_NAME   = 'event-holiday_drakes';
const ACTION_PRESENT   = 'present';
const ACTION_COME_BACK = 'come_back';

const STAT_HOLIDAY_PRESENT = 'holiday_present';

const MONTH_JANUARY = 0;
const MONTH_DECEMBER = 11;

const STANDARD_CONSUMABLES = [
  'consumables-antidote',
  'consumables-blessing',
  'consumables-cold_compress',
  'consumables-elixir',
  'consumables-hot_chocolate',
  'consumables-potion',
  'consumables-smelling_salts',
  'consumables-smoke_bomb',
];

const CATALYSTS = [
  'catalyst-crystal_acid',
  'catalyst-moondrop',
  'catalyst-quicksalt',
];

/**
 * Little golden drakes wearing holiday caps.  Visit for daily presents!
 */
class HolidayDrakesEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You approach the little golden drakes surrounded by piles of presents.  They frolic and play, trying to knock off each other's little red holiday caps."),
    });
  }

  /**
   * Image of the lost purse.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/watermoon/holiday_drake.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Holiday Drakes");
  }

  /**
   * Get the actions for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    if (this.canGetTodaysPresent(character)) {
      actions.addButton(__("Get a present!"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_PRESENT } } );
    }

    actions.addButton(__("Come back later"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_COME_BACK } } );

    return actions;
  }

  /**
   * If the character hasn't claimed today's present yet.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  canGetTodaysPresent(character) {
    return ! character.hasStat(STAT_HOLIDAY_PRESENT, { subType: moment().format('YYYY-MM-DD') });
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let title = '';

    // Clear the encounter state
    character.state = CHARACTER_STATE.IDLE;

    if (ACTION_PRESENT === action) {
      title = this.getPresent(character);
    }
    else if (ACTION_COME_BACK === action) {
      title = this.comeBack(character);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Get the day's present.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  getPresent(character) {
    character.setStat(STAT_HOLIDAY_PRESENT, 1, moment().format('YYYY-MM-DD'));

    return this.addPresents(character);
  }

  /**
   * Add the day's presents to character, return a description of the gained presents.
   *
   * @param {Character} character - The character to add presents to.
   *
   * @return {message}
   */
  addPresents(character) {
    const presents = this.getPresentContents(character);
    let presentsDescriptions = [`${presents.gold} gold`];
    character.gold += presents.gold;

    for (let { type, quantity } of presents.items) {
      const item = Items.new(type);
      const itemName = pluralize(item.getDisplayName(character), quantity);
      presentsDescriptions.push(`${quantity}x ${itemName}`);
      character.inventory.add(type, quantity);
    }

    if (get(presents, 'scales')) {
      presentsDescriptions.push(`${presents.scales} Dragon Scales`);
      character.scales += presents.scales;
    }

    return `You humbly approach the Holiday Drakes, who happily nudge a present your way.  You rip into it and discover ${listify(presentsDescriptions)}!`;
  }

  /**
   * Get the contents of a present.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {array}
   */
  getPresentContents(character) {
    return this.isSpecialDay()
      ? this.getSpecialPresents(character)
      : this.getStandardPresents(character);
  }

  /**
   * If this is a "special" day - Dec 25 or Jan 1.
   *
   * @return {boolean}
   */
  isSpecialDay() {
    const month = moment().month();
    const day = moment().date();

    return (month === MONTH_DECEMBER && day === 25) || (month === MONTH_JANUARY && day === 1);
  }

  /**
   * Get presents for a character on a standard day.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {objects}
   */
  getStandardPresents(character) {
    const gold = character.level * getWeighted([
      { 'weight': 20, value: 2 },
      { 'weight': 30, value: 4 },
      { 'weight': 30, value: 6 },
      { 'weight': 10, value: 8 },
      { 'weight': 10, value: 10 },
    ]);

    let items = [];
    items.push({ type: fromArray(STANDARD_CONSUMABLES), quantity: between(3, 5) });
    items.push({ type: fromArray(STANDARD_CONSUMABLES), quantity: between(3, 5) });
    items.push({ type: fromArray(STANDARD_CONSUMABLES), quantity: between(3, 5) });
    items.push({ type: fromArray(CATALYSTS), quantity: between(1, 3) });

    return { gold, items };
  }

  /**
   * Get presents for a character on a standard day.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {array}
   */
  getSpecialPresents(character) {
    const gold = character.level * 25;

    let items = [];
    items.push({ type: 'catalyst-crystal_acid', quantity: between(3, 5) });
    items.push({ type: 'catalyst-moondrop', quantity: between(3, 5) });
    items.push({ type: 'catalyst-quicksalt', quantity: between(3, 5) });

    const scales = 15;

    return { gold, items, scales };
  }

  /**
   * Come back later, get another present tomorrow.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  comeBack(character) {
    return "You decide to come back later.  Perhaps there will be another present tomorrow!";
  }
}

module.exports = HolidayDrakesEncounter;