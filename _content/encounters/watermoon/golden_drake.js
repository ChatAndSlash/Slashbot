"use strict";

const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Encounter   = require('@app/content/encounters').Encounter;
const Random      = require('@util/random');
const Num         = require('@util/num');
const Text        = require('@util/text');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;

const ENCOUNTER_NAME  = 'watermoon-golden_drake';
const ACTION_AP       = 'ap';
const ACTION_HP_MP    = 'hpmp';
const ACTION_TREASURE = 'treasure';

const TREASURE_SCALES    = 'scales';
const TREASURE_MOONDROPS = 'moondrops';
const TREASURE_GOLD      = 'gold';

const MIN_SCALES = 1;
const MAX_SCALES = 3;

const MIN_MOONDROPS = 3;
const MAX_MOONDROPS = 6;

const MIN_SMALL_MOONDROPS = 1;
const MAX_SMALL_MOONDROPS = 3;
const MIN_GOLD = 1000;
const MAX_GOLD = 2500;

/**
 * Golden Drake encounter.
 */
class GoldenDrakeEncounter extends Encounter {
  constructor() {
    let actions = new Actions();
    actions.addButton(__("AP Refill"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_AP } } );
    actions.addButton(__("HP/MP Refill"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_HP_MP } } );
    actions.addButton(__("Treasure"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_TREASURE } } );

    super({
      type: ENCOUNTER_NAME,
      description: __("As you explore, you feel a tap on your shoulder.  You turn around, finding nothing.  You shrug and turn back, only to find a tiny Golden Drake hovering in the air in front of you!\n\n\"Hi!\" she says.  \"Look, I'm just here to pass along a message and a favour.  Aureth really appreciates what you're doing around here, so she wants to help you out.  Do you want:\n\n- A full health and mana restore?\n- A full Action Point restore?\n- Or some treasure?"),
      actions
    });
  }

  /**
   * Get the image for this encounter.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return 'encounters/watermoon/gold_drake.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Golden Drake");
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let title;

    if (ACTION_AP === action) {
      title = this.doApRefill(character);
    }
    else if (ACTION_HP_MP === action) {
      title = this.doHpMpRefill(character);
    }
    else if (ACTION_TREASURE === action) {
      title = this.doGiveTreasure(character);
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title, color: COLORS.GOOD }),
      doLook: true
    });
  }

  /**
   * Fill the character's AP.
   *
   * @param {Character} character - The character to fill the AP for.
   *
   * @return {string}
   */
  doApRefill(character) {
    character.ap = character.maxAp;
    return ":white_check_mark: \"Gotcha,\" she says.  \"Just hold still!\"  She waggles her little tail at you, and a golden aura surrounds you.  You feel energized!";
  }

  /**
   * Fill the character's HP/MP.
   *
   * @param {Character} character - The character to fill the AP for.
   *
   * @return {string}
   */
  doHpMpRefill(character) {
    character.hp = character.maxHp;
    character.mp = character.maxMp;
    return ":white_check_mark: \"No worries!\" she says.  \"I got this!\"  She wriggles her little nose at you, and a feeling of wellness infuses you.";
  }

  /**
   * Give the character some treasure!
   *
   * @param {Character} character - The character to fill the AP for.
   *
   * @return {string}
   */
  doGiveTreasure(character) {
    const type = this.getRandomTreasureType();
    let treasure;

    if (TREASURE_MOONDROPS === type) {
      const quantity = this.getNumMoondrops();
      character.inventory.add('catalyst-moondrop', quantity);
      treasure = __("%d Moondrops", quantity);
    }
    else if (TREASURE_GOLD === type) {
      const quantityMoondrops = this.getNumSmallMoondrops();
      character.inventory.add('catalyst-moondrop', quantityMoondrops);

      const quantityGold = this.getNumSmallGold();
      character.gold += quantityGold;

      treasure = __(
        "%d %s and %d gold",
        quantityMoondrops,
        Text.pluralize("Moondrop", quantityMoondrops),
        quantityGold
      );
    }
    else if (TREASURE_SCALES === type) {
      const quantity = this.getNumScales();
      character.scales += quantity;

      treasure = __("%d Dragon %s", quantity, Text.pluralize("Scale", quantity));
    }

    return __(":white_check_mark: \"Yeah, treasure, I can dig it!\" she says.  She sniffs a couple times, looks around, then flies over to a spot on the ground and scratches an X.  \"Dig here!\" she giggles, and then flies off.  After digging a little while, you discover a leather bag containing %s!", treasure);
  }

  /**
   * Get the random type of treasure to give.  (scales, moondrops, gold)
   *
   * @return {string}
   */
  getRandomTreasureType() {
    const types = [TREASURE_GOLD, TREASURE_MOONDROPS, TREASURE_SCALES];
    return Random.fromArray(types);
  }

  /**
   * Get the random amount of scales to give.
   *
   * @return {integer}
   */
  getNumScales() {
    return Random.between(MIN_SCALES, MAX_SCALES);
  }

  /**
   * Get the random amount of Moondrops to give.
   *
   * @return {integer}
   */
  getNumMoondrops() {
    return Random.between(MIN_MOONDROPS, MAX_MOONDROPS);
  }

  /**
   * Get the random amount of Moondrops to give when also giving gold.
   *
   * @return {integer}
   */
  getNumSmallMoondrops() {
    return Random.between(MIN_SMALL_MOONDROPS, MAX_SMALL_MOONDROPS);
  }

  /**
   * Get the random amount of gold to give.
   *
   * @return {integer}
   */
  getNumSmallGold() {
    return Num.roundToMultiple(Random.between(MIN_GOLD, MAX_GOLD), 50);
  }
}

module.exports = GoldenDrakeEncounter;