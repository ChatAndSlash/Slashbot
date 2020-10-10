"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Enemies     = require('@app/content/enemies').Enemies;
const Random      = require('@util/random');
const Text        = require('@util/text');
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STATS           = require('@constants').STATS;

const ENCOUNTER_NAME   = 'scatterslide-stone_pile';
const ACTION_STONES    = 'stones';
const ACTION_VALUABLES = 'valuables';

/**
 * A pile of stones that can be looked through for good blocks.
 */
class StonePileEncounter extends Encounter {
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
    return __("While exploring, you come across a pile of cut stones that you haven't picked over yet that were intended to be used to reinforce the various levels of the mine.  The workers here left in a hurry and left their gear scattered everywhere.  ")
      + (character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)
        ? __("You've already found all the stone blocks you need, but you can still look for valuables.") // eslint-disable-line indent
        : __("You can spend your time looking for stone blocks or valuables.")); // eslint-disable-line indent
  }

  /**
   * Get the action buttons for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {array}
   */
  getActions(character) {
    let actions = new Actions();

    if ( ! character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)) {
      actions.addButton(__("Stones"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_STONES } } );
    }

    actions.addButton(__("Valuables"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_VALUABLES } } );
    return actions;
  }

  /**
   * Image of the stone pile.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/scatterslide/stone_pile.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Stone Pile");
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

    if (ACTION_STONES === action) {
      title = this.lookForStones(character);
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
   * Look in the stone pile for stones.
   *
   * @param {Character} character - The character looking in the stone pile.
   *
   * @return {string}
   */
  lookForStones(character) {
    let title  = '';
    const chance = Random.between(1, 10);

    // Find some stones
    if (chance > 1) {
      const stones = character.inventory.add('quest-stone_block', Random.between(5, 10));

      title = __("You search for a while and recover %d %s that %s still in quite good condition.", stones, Text.pluralize('stone', stones), (stones > 1 ? __('are') : __('is')) );
    }
    // Get attacked!
    else {
      const enemy = Enemies.new('scatterslide-quarry-01-kobold_scavenger');
      const level = character.location.getEnemyLevel(enemy, character);
      enemy.setLevel(level);
      character.enemy = enemy;
      character.state = CHARACTER_STATE.FIGHTING;

      title = __(":warning:  As you pick through the pile, you knock over some stones setting off a loud chain reaction.  The noise attracts a level %s %s!", level, enemy.getDisplayName(character));
    }

    return title;
  }

  /**
   * Look in the stone pile for valuables.
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
      const enemy = Enemies.new('scatterslide-quarry-01-kobold_scavenger');
      const level = character.location.getEnemyLevel(enemy, character);
      enemy.setLevel(level);
      character.enemy = enemy;
      character.state = CHARACTER_STATE.FIGHTING;

      title = __(":warning:  As you pick through the pile, you knock over some stones setting off a loud chain reaction.  The noise attracts a level %s %s!", level, enemy.getDisplayName(character));
    }

    return title;
  }
}

module.exports = StonePileEncounter;