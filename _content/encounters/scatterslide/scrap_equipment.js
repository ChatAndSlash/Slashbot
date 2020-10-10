"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Enemies     = require('@app/content/enemies').Enemies;
const Random      = require('@util/random');
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STATS           = require('@constants').STATS;

const ENCOUNTER_NAME = 'scatterslide-scrap_equipment';
const ACTION_SCRAP   = 'scrap';
const ACTION_VALUABLES = 'valuables';

/**
 * A pile of scrap equipment that might have some scrap metal left in it.
 */
class ScrapEquipmentEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      title: __("What do you want to search for?")
    });
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    return __("You turn a corner and come across a pile of scrap equipment.  If you're lucky, there may be some useful copper scraps left over you could use to help rebuild the Artificer back in camp.")
      + (character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)
        ? __("You've already found all the scrap metal you need, but you can still look for valuables.") // eslint-disable-line indent
        : __("You can spend your time looking for scrap metal or valuables.")); // eslint-disable-line indent
  }

  /**
   * Get the action buttons for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();

    if ( ! character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      actions.addButton(__("Look for Scrap"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_SCRAP } } );
    }

    actions.addButton(__("Valuables"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_VALUABLES } } );
    return actions;
  }

  /**
   * Image of the scrap equipment.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/scatterslide/scrap_equipment.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Scrap Equipment");
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

    // Set state BEFORE looking, as an enemy encounter trigger can happen, which changes the
    // states to fighting
    character.state = CHARACTER_STATE.IDLE;

    if (ACTION_SCRAP === action) {
      title = this.lookForScrap(character);
    }
    else if (ACTION_VALUABLES === action) {
      title = this.lookForValuables(character);
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
   * Look in the scrap equipment for scrap metal.
   *
   * @param {Character} character - The character looking in the scrap equipment.
   *
   * @return {string}
   */
  lookForScrap(character) {
    let title  = '';
    const chance = Random.between(1, 10);

    // Find some scrap metal
    if (chance > 1) {
      character.state = CHARACTER_STATE.IDLE;
      const scraps = character.inventory.add('quest-scrap_metal', Random.between(5, 10));
      title = __("You pore over the pile and recover %d scrap metal that you figure the Artificer will be able to use to rebuild.", scraps);
    }
    // Get attacked!
    else {
      const enemy = Enemies.new('scatterslide-mine-01-pebble_creeper');
      const level = character.location.getEnemyLevel(enemy, character);
      enemy.setLevel(level);
      character.enemy = enemy;
      character.state = CHARACTER_STATE.FIGHTING;

      title = __(":warning:  As you dig inexpertly through the loose pile of equipment, you make a series of loud clanks that attracts a level %s %s!", level, enemy.getDisplayName(character));
    }

    return title;
  }

  /**
   * Look in the scrap equipment for valuables.
   *
   * @param {Character} chracter - The character not looking.
   *
   * @return {string}
   */
  lookForValuables(character) {
    let title  = '';
    const chance = Random.between(1, 10);

    // Find some gold
    if (chance > 1) {
      const gold = Random.between(35, 75);
      character.gold += gold;

      title = __("You search for a while and recover %d gold that was left behind.", gold);
    }
    // Get attacked!
    else {
      const enemy = Enemies.new('scatterslide-mine-01-pebble_creeper');
      const level = character.location.getEnemyLevel(enemy, character);
      enemy.setLevel(level);
      character.enemy = enemy;
      character.state = CHARACTER_STATE.FIGHTING;

      title = __(":warning:  As you dig inexpertly through the loose pile of equipment, you make a series of loud clanks that attracts a level %s %s!", level, enemy.getDisplayName(character));
    }

    return title;
  }
}

module.exports = ScrapEquipmentEncounter;