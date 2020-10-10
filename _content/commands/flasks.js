"use strict";

const Actions     = require('slacksimple').Actions;
const Text        = require('@util/text');
const Command     = require('@app/content/commands').Command;
const Attachments = require('slacksimple').Attachments;
const Items       = require('@app/content/items').Items;

const STATS = require('@constants').STATS;

/**
 * Drink a flask, get a stat boost.
 */
class FlasksCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === 'drink') {
      await this.drinkFlask();
    }
    else {
      await this.showFlasks();
    }
  }

  /**
   * Show the flasks available for purchase, and their price.
   */
  async showFlasks() {
    const character = this.character;

    let description = character.location.getDescription(character);
    description += __('\n\n"Well, if you have any alchemical catalysts laying around, I can mix a mean flask of magical wine that can make you more powerful.  The more you use, the more catalysts it\'ll take to improve any further, of course!  You get resistant to this stuff."');
    description += this.getFlaskDescriptions(character);
    description += this.getCatalystsOwnedText(character);

    await this.updateLast({
      description,
      attachments: Attachments.one({
        title: __('What do you want to improve?'),
        actions: this.getFlaskButtons(character),
      })
    });
  }

  /**
   * Get flask effects and prices.
   *
   * @param {Character} character - The character considering buying flasks.
   *
   * @return {string}
   */
  getFlaskDescriptions(character) {
    let description = '';
    for (const flaskType of character.location.flasks) {
      let increase = this.getStatIncrease(character, flaskType);
      increase = increase < 1 ? `${increase * 100}%` : increase;
      description += `\n>- *+${increase} ${Text.getLongAttributeName(flaskType)}:* ${this.getCostDescription(character, flaskType)}`;
    }

    return description;
  }

  /**
   * Get the list of relevant catalysts owned by a character.
   *
   * @param {Character} character - The character considering buying flasks.
   *
   * @return {string}
   */
  getCatalystsOwnedText(character) {
    let catalystsOwned = new Set();
    for (const flaskType of character.location.flasks) {
      const catalyst = this.getFlaskCatalyst(flaskType);
      const qty = character.inventory.quantity(catalyst.type);
      catalystsOwned.add(__(
        "%dx %s",
        qty,
        Text.pluralize(catalyst.getDisplayName(character), qty)
      ));
    }

    return __("\n\nYou have *%s* to spend.", Array.from(catalystsOwned).join(", "));
  }

  /**
   * Get the flask buttons for which flask to buy.
   *
   * @param {Character} character - The character buying flasks.
   *
   * @return {Actions}
   */
  getFlaskButtons(character) {
    let actions = new Actions();
    for (let flaskType of character.location.flasks) {

      const catalyst = this.getFlaskCatalyst(flaskType);
      const style = character.inventory.has(catalyst.type, this.getCost(character, flaskType))
        ? 'primary'
        : 'danger';

      actions.addButton(
        Text.getLongAttributeName(flaskType),
        "flasks",
        { params: { action: "drink", flaskType }, style }
      );
    }
    actions.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    return actions;
  }

  /**
   * Get the description for the cost to buy this flask.
   *
   * @param {Character} character - The character getting the cost description.
   * @param {string} flaskType - The short stat type. (force, defence, etc)
   *
   * @return {string}
   */
  getCostDescription(character, flaskType) {
    const cost = this.getCost(character, flaskType);
    const name = Text.pluralize(this.getFlaskCatalyst(flaskType).getDisplayName(character), cost);
    return `${cost}x ${name}`;
  }

  /**
   * Get the cost to buy a flask that increases a stat.
   * 1, 2, 3, 4, 5, 9, 16, 25, 36, etc...
   *
   * @param {Character} character - The character increasing the stat.
   * @param {string} flaskType - The type of flask being purchased.
   *
   * @return {integer}
   */
  getCost(character, flaskType) {
    const next = character.getStat(STATS.FLASK_PURCHASED, flaskType) + 1;

    if (next <= 5) {
      return next;
    }

    return Math.pow(next - 3, 2);
  }

  /**
   * Get the catalyst used to create a flask for the povided type.
   *
   * @param {string} flaskType - The short stat type. (force, defence, etc)
   *
   * @return {CatalystItem}
   */
  getFlaskCatalyst(flaskType) {
    switch (flaskType) {
      case 'force':
      case 'technique':
      case 'defence':
        return Items.new('catalyst-crystal_acid');

      case 'maxHp':
      case 'maxMp':
        return Items.new('catalyst-quicksalt');

      case 'minDamage':
      case 'maxDamage':
      case 'spellPower':
        return Items.new('catalyst-moondrop');

      default:
        throw new Error(`No catalyst defined for stat: '${flaskType}.'`);
    }
  }

  /**
   * Drink a flask, gain its effects.
   */
  async drinkFlask() {
    let character = this.character;

    const flaskType = this.info.flaskType;
    const catalyst  = this.getFlaskCatalyst(flaskType);

    let title = '';
    const catalystCost = this.getCost(character, flaskType);

    // If character can afford the flask
    if (character.inventory.has(catalyst.type, catalystCost)) {
      const statIncrease = this.getStatIncrease(character, flaskType);

      character.inventory.remove(catalyst.type, catalystCost);
      this.increaseStat(character, flaskType);
      character.increaseStat(STATS.FLASK_PURCHASED, 1, flaskType);

      const increaseText = this.getIncreaseText(statIncrease, flaskType);
      title = __(
        ":wine_glass: You give the tavernkeeper %d %s and he hands you a softly-glowing flask.  After brief hesitation, you toss it back and feel it course through you.  You gain %s!",
        catalystCost,
        Text.pluralize(catalyst.getDisplayName(character), catalystCost),
        increaseText
      );

      // Can't afford the flask
    }
    else {
      title = __("You don't have enough %s to buy that.", Text.pluralize(catalyst.getDisplayName(character), 2));
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Get the text to display when increasing a stat.
   *
   * @param {integer} increase - The amount to increase by.
   * @param {string} type - The type of stat being incrases.
   *
   * @return {string}
   */
  getIncreaseText(increase, type) {
    if (increase < 1) {
      return __("%d%% %s", increase * 100, Text.getLongAttributeName(type).toLowerCase());
    }

    return __("%d %s", increase, Text.getLongAttributeName(type).toLowerCase());
  }

  /**
   * Get the amount to increase a stat after having bought a flask.  Not all stats increase by
   * the same amount.
   *
   * @param {Character} character - The character increasing their stat.
   * @param {string} stat - The statistic being improved.
   *
   * @return {integer}
   */
  getStatIncrease(character, stat) {
    switch (stat) {
      case 'force':
      case 'technique':
      case 'defence':
      case 'spellPower':
        return 1;

      case 'minDamage':
      case 'maxDamage':
        return 0.05;

      case 'maxHp':
        return 10;

      case 'maxMp':
        return 5;
    }
  }

  /**
   * Increase a stat for a flask.
   *
   * @param {Character} character - The character increasing the stat.
   * @param {string} stat - The stat to increase.
   */
  increaseStat(character, stat) {
    // All these stats don't have actual character stats that get increased
    const ignoredStats = [
      'minDamage',
      'maxDamage',
    ];

    if (ignoredStats.includes(stat)) {
      return;
    }

    // All these stats have private versions that must be set when increasing
    const privateStats = [
      'maxHp',
      'force',
      'technique',
      'defence',
      'spellPower',
    ];

    const characterStat = privateStats.includes(stat)
      ? `_${stat}`
      : stat;

    character[characterStat] += this.getStatIncrease(character, stat);
  }
}

module.exports = FlasksCommand;