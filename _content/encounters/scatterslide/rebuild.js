"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STATS           = require('@constants').STATS;

const ENCOUNTER_NAME            = 'scatterslide-rebuild';
const ACTION_REBUILD_BLACKSMITH = 'blacksmith';
const ACTION_REBUILD_ARTIFICER  = 'artificer';
const ACTION_CANCEL             = 'cancel';

const ITEM_STONE_BLOCK  = 'quest-stone_block';
const ITEM_METAL_SCRAPS = 'quest-scrap_metal';

const REQUIRED_STONE_BLOCK  = 75;
const REQUIRED_METAL_SCRAPS = 75;

/**
 * Rebuild the blacksmith & artificer.
 */
class RebuildEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      title: __('What building do you want to work on?'),
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
    let title = __("You look around the wrecked campsite at the buildings that still need to be rebuilt.\n\n");

    if ( ! character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)) {
      const remaining = REQUIRED_STONE_BLOCK - character.inventory.quantity(ITEM_STONE_BLOCK);
      title += __("The blacksmith still needs work, and requires another %d stones (for a total of %d).\n", remaining, REQUIRED_STONE_BLOCK);
    }

    if ( ! character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      const remaining = REQUIRED_METAL_SCRAPS - character.inventory.quantity(ITEM_METAL_SCRAPS);
      title += __("The artificer still needs work, and requires another %d scrap metal (for a total of %d).", remaining, REQUIRED_METAL_SCRAPS);
    }

    return title;
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
      const style = character.inventory.has(ITEM_STONE_BLOCK, REQUIRED_STONE_BLOCK) ? '' : 'danger';
      actions.addButton(__("Blacksmith"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_REBUILD_BLACKSMITH }, style } );
    }

    if ( ! character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      const style = character.inventory.has(ITEM_METAL_SCRAPS, REQUIRED_METAL_SCRAPS) ? '' : 'danger';
      actions.addButton(__("Artificer"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_REBUILD_ARTIFICER }, style } );
    }

    actions.addButton(__("Cancel"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_CANCEL } } );

    return actions;
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

    if (ACTION_REBUILD_BLACKSMITH === action) {
      title = this.rebuildBlacksmith(character);
    }
    else if (ACTION_REBUILD_ARTIFICER === action) {
      title = this.rebuildArtificer(character);
    }
    else if (ACTION_CANCEL === action) {
      title = this.cancel(character);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Rebuild the blacksmith.
   *
   * @param {Character} character - The character rebuilding the blacksmith.
   */
  rebuildBlacksmith(character) {
    let title = '';

    if (character.inventory.has(ITEM_STONE_BLOCK, REQUIRED_STONE_BLOCK)) {
      character.track('Rebuild Scatterslide Blacksmith');

      character.inventory.remove(ITEM_STONE_BLOCK, REQUIRED_STONE_BLOCK);
      character.setStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT);
      title = __("A stout woman sitting around the campfire joins you, and together you rebuild the Blacksmith building.  She thanks you, and gets right to work heating the bellows.");
    }
    else {
      title = __("You don't have enough stones to rebuild the Blacksmith.");
    }

    return title;
  }

  /**
   * Rebuild the artificer.
   *
   * @param {Character} character - The character rebuilding the blacksmith.
   */
  rebuildArtificer(character) {
    let title = '';

    if (character.inventory.has(ITEM_METAL_SCRAPS, REQUIRED_METAL_SCRAPS)) {
      character.track('Rebuild Scatterslide Artificer');

      character.inventory.remove(ITEM_METAL_SCRAPS, REQUIRED_METAL_SCRAPS);
      character.setStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT);
      title = __("An aged man sitting very close to the campfire joins you, and together you rebuild the Artificer building.  He thanks you, and hobbles inside to begin tinkering.");
    }
    else {
      title = __("You don't have enough scrap metal to rebuild the Artificer.");
    }

    return title;
  }

  /**
   * Actually, don't rebuild anything.
   *
   * @param {Character} character - The character rebuilding the blacksmith.
   */
  cancel(character) {
    return __("Maybe later.");
  }
}

module.exports = RebuildEncounter;