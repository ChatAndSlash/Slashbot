"use strict";

const { pluralize } = require('@util/text');

const FLAGS           = require('@constants').FLAGS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const TYPE_CROSSROADS_ENCOUNTER = 'watermoon-scholar-crossroads';

/**
 * Scholar Labyrinth common functions.
 *
 * @return {Mixin}
 */
const HallwayLocation = () => {
  return (Location) => class extends Location {
    constructor(info = {}) {
      info.encounters = [
        { value: 'fight', weight: 98 },
        { value: 'watermoon-scholar-lost_trader', weight: 2 },
      ];

      info.itemCostMultiplier = 5;
      info.shopItems = {
        'provisions': {
          shopText: __('Buy Provisions'),
          items: [
            'consumables-potion',
            'consumables-elixir',
            'consumables-antidote',
            'consumables-smelling_salts',
            'consumables-cold_compress',
            'consumables-hot_chocolate',
            'consumables-blessing',
            'torch',
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

      super(info);

      this.bossTypes = [
        'watermoon-scholar-empusa',
        'watermoon-scholar-minotaur',
        'watermoon-scholar-gorgon',
        'watermoon-scholar-black_dragon',
      ];
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
      if (CHARACTER_STATE.ENCOUNTER === character.state && "watermoon-scholar-lost_trader" === character.encounter.type) {
        return character.encounter.getDescription(character);
      }

      return this._description;
    }

    /**
     * Gets the length of this hallway.
     *
     * @return {integer}
     */
    getLength() {
      return 10;
    }

    /**
     * Pretend this location doesn't have any items, so we don't show buttons to buy.
     *
     * @param {Character} character - The character doing the buying.
     *
     * @return {boolean}
     */
    hasShopItems(character) {
      return false;
    }

    /**
     * Get any warning needed when teleporting away from this location.
     *
     * @param {Character} character - The character doing the teleporting.
     *
     * @return {string}
     */
    getTeleportWarning(character) {
      return __("\n\n*Be careful teleporting away from this location, as you will only be able to come back to your last crossroads checkpoint.*");
    }

    /**
     * Get the text describing the proress down this hallway.
     *
     * @param {Character} character - The character to get the progress text for.
     *
     * @return {string}
     */
    getProgressText(character) {
      const remaining = character.getFlag(FLAGS.HALLWAY_REMAINING);
      return __(
        "\n\n%d %s %s until the end of the hallway.",
        remaining,
        pluralize("fight", remaining),
        1 === remaining ? __("remains") : __("remain"),
      );
    }

    /**
     * Perform any post-fight actions that always happen.
     *
     * @param {Character} character - The character who won the fight.
     * @param {array} messages - The messages already generated in this fight.
     *
     * @return {array}
     */
    doFightSuccess(character, messages) {
      messages = super.doFightSuccess(character, messages);

      character.decrementFlag(FLAGS.HALLWAY_REMAINING);

      if (character.getFlag(FLAGS.HALLWAY_REMAINING, 0) === 0) {
        character.incrementFlag(FLAGS.HALLWAYS_COMPLETED);

        const completed = character.getFlag(FLAGS.HALLWAYS_COMPLETED);
        if (completed % 10 === 0 && completed > 0) {
          messages = this.encounterBoss(character, messages);
        }
        else {
          messages = this.encounterCrossroads(character, messages);
        }
      }

      return messages;
    }

    /**
     * Encounter a boss at the quarter, half, and three-quarter mark.
     *
     * @param {Character} chaaracter - The character encountering the boss.
     * @param {array} messages - The previously-generated messages.
     *
     * @return {array}
     */
    encounterBoss(character, messages) {
      let bossType;
      if (character.getFlag(FLAGS.HALLWAYS_COMPLETED) < 40 || ! character.hasKilledBlackDragon()) {
        bossType = this.chooseBoss(character.getFlag(FLAGS.HALLWAYS_COMPLETED));
      }
      else {
        bossType = character.getFlag(FLAGS.SCHOLAR_BOSS);
      }

      character.enemy = character.location.buildEnemy(character, bossType);
      character.state = CHARACTER_STATE.FIGHTING;

      const enemyName = character.enemy.getDisplayName(character);
      const determiner = character.enemy.getDeterminer(character);

      messages.push(`On reaching the end of the hallway, you come across a powerful enemy... *${determiner}${enemyName}!*`);

      return messages;
    }

    /**
     * Determine the type of boss the character will be facing.
     *
     * @param {integer} completed - The number of hallways completed.
     *
     * @return {string}
     */
    chooseBoss(completed) {
      const bosses = {
        10: 'watermoon-scholar-empusa',
        20: 'watermoon-scholar-minotaur',
        30: 'watermoon-scholar-gorgon',
        40: 'watermoon-scholar-black_dragon',
      };

      if (_.isUndefined(bosses[completed])) {
        throw new Error(`No boss for ${completed} hallways completed.`);
      }

      return bosses[completed];
    }

    /**
     * Miniboss gets 25% level bonus, Dragon 50%.
     *
     * @param {Enemy} enemy - The enemy to get the level bonus for.
     * @param {Character} character - The character in this location.
     * @param {string} type - The type of the enemy to check.
     *
     * @return {integer}
     */
    getEnemyLevelBonus(enemy, character, type) {
      const level = character.location.getEnemyLevel(enemy, character);

      if ('watermoon-scholar-black_dragon' === type) {
        return Math.ceil(level * 0.5);
      }
      else if (this.bossTypes.includes(type)) {
        return Math.ceil(level * 0.25);
      }

      return super.getEnemyLevelBonus(enemy, character, type);
    }

    /**
     * Encounter a crossroads.
     *
     * @param {Character} character - The character encountering the crossroads.
     * @param {array} messages - The previously-generated messages.
     *
     * @return {array}
     */
    encounterCrossroads(character, messages) {
      const Encounters = require('@app/content/encounters').Encounters;
      character.encounter = Encounters.new(TYPE_CROSSROADS_ENCOUNTER);
      character.state = CHARACTER_STATE.ENCOUNTER;

      messages.push(__("On reaching the end of the hallway, you come to a crossroads!"));

      if (character.getFlag(FLAGS.HALLWAYS_COMPLETED) % 5 === 0) {
        messages.push(__("This crossroads is very distinctive.  You know you'll be able to find your way back here again if you leave."));
      }

      return messages;
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
      actions.addAction(character.location.getLeaveLabyrinthButton(character));
      return actions;
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
      let encounters = this.encounters;

      if (character.accessory.type === 'equipment-accessories-watermoon-050_goldscale_ring') {
        encounters = character.accessory.addGoldDrakeEncounter(encounters);
      }

      return encounters;
    }
  };
};

module.exports = {
  HallwayLocation
};