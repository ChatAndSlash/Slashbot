"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Random      = require('@util/random');
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Text        = require('@util/text');
const Items       = require('@app/content/items').Items;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const STATS           = require('@constants').STATS;
const FLAGS           = require('@constants').FLAGS;
const COLORS          = require('@constants').COLORS;

const CURSED_CHEST_FRAILTY_PENALTY = require('@constants').CURSED_CHEST_FRAILTY_PENALTY;
const CURSED_CHEST_MISS_CHANCE     = require('@constants').CURSED_CHEST_MISS_CHANCE;

const ENCOUNTER_NAME        = 'cursed_chest';

const ACTION_BLESSED        = 'blessed_key';
const ACTION_OPEN           = 'open_it';
const ACTION_LEAVE_IT_ALONE = 'leave_it';

const TYPE_BLESSED_KEY = 'blessed_key';

const CURSE_TURNS = 5;

/**
 * A cursed chest, with great riches but a terrible curse!
 */
class CursedChestEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
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
    return 'encounters/cursed_chest.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Cursed Chest");
  }

  /**
   * Alter description based on how deep in the mine the character is.
   *
   * @param {Character} character - The character getting location description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = __("You come across a softly-glowing chest.  As you approach, a deep sense of unease grows in your heart.  Clearly the chest contains great riches, but you worry that a terrible curse will befall you if you try to claim them.");

    if (character.inventory.has(TYPE_BLESSED_KEY)) {
      description += __("\n\n:key: You feel a tug from your pack, and reach in to find a Blessed Key faintly vibrating with energy.  As you grasp it in your hand, it seems to pull towards the chest and the ill feeling in your chest eases.");
    }

    return description;
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

    if (character.inventory.has(TYPE_BLESSED_KEY)) {
      actions.addButton(__("Use a Blessed Key"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_BLESSED } } );
    }

    actions.addButton(__("Open it..."), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_OPEN } } );
    actions.addButton(__("Leave it alone"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE_IT_ALONE } } );

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
    let color = '';

    character.state = CHARACTER_STATE.IDLE;
    character.setFlag(FLAGS.CHEST_CURSE_FIGHTS, 1);

    if (ACTION_BLESSED === action) {
      title = await this.useKey(character);
      character.increaseStat(STATS.CURSED_CHEST, 1, ACTION_BLESSED);
      color = COLORS.GOOD;
    }
    else if (ACTION_OPEN === action) {
      title = await this.openChest(character);
      character.increaseStat(STATS.CURSED_CHEST, 1, ACTION_OPEN);
      color = '#e50bde';
    }
    else if (ACTION_LEAVE_IT_ALONE === action) {
      title = this.leaveIt(character);
      character.increaseStat(STATS.CURSED_CHEST, 1, ACTION_LEAVE_IT_ALONE);
      color = COLORS.INFO;
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    await this.updateLast({
      attachments: Attachments.one({ title, color }),
      doLook: true
    });
  }

  /**
   * Use a Blessed Key on the chest.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  async useKey(character) {
    let title = __("You insert a Blessed Key in the hole on the chest and turn it.  No lock unlocks, but the evil glow dissipates, and the key turns to dust in your hands.  You lift the lid on the chest and find:");

    title += await this.addSpoils(character);
    character.inventory.remove(TYPE_BLESSED_KEY);

    character.track('Cursed Chest', {
      method: 'Blessed key'
    });


    return title;
  }

  /**
   * Open the chest, suffer the curse.
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  async openChest(character) {
    let title = __("You decide to risk it, and gathering your courage, boldly raise the lid.  A sharp violet light bursts from the chest and you flinch back, but nothing seems to happen.  Inside the chest, you find:");

    title += await this.addSpoils(character);
    title += this.addCurse(character);

    character.track('Cursed Chest', {
      method: 'Curse'
    });

    return title;
  }

  /**
   * Adds a randomly-chosen curse to the character.
   *
   * @param {Character} character - The character to add the curse to.
   *
   * @return {string}
   */
  addCurse(character) {
    let title = '';

    const curse = Random.fromArray([
      FLAGS.CHEST_CURSE_FRAILTY,
      FLAGS.CHEST_CURSE_CLUMSY,
    ]);

    character.setFlag(curse, CURSE_TURNS);

    if (FLAGS.CHEST_CURSE_FRAILTY === curse) {
      title += __("\nSuddenly, you feel your muscles slacken as you begin to wheeze and cough.  You've lost %d%% of your Max HP for the next %d fights!", CURSED_CHEST_FRAILTY_PENALTY * 100,  CURSE_TURNS);
      character.hp = Math.min(character.hp, character.maxHp);
    }
    else if (FLAGS.CHEST_CURSE_CLUMSY == curse) {
      title += __("\nThe loot you just picked up slips through your fingers as you suddenly trip and fall to the ground.  When you stand up and try to recover it, you step on your own foot.  You now have a %d%% chance to miss for the next %d fights!", CURSED_CHEST_MISS_CHANCE, CURSE_TURNS);
    }

    return title;
  }

  /**
   * Add the loot and gold the provided character.
   *
   * @param {Character} character - The character looting the chest.
   *
   * @return {string} The results of adding the loot.
   */
  async addSpoils(character) {
    let text = "";

    for (const entry of this.getLoot(character)) {
      entry.quantity = character.inventory.add(entry.type, entry.quantity);
      text += `\n- ${entry.quantity}x ${Text.pluralize(Items.getName(entry.type), entry.quantity)}`;
    }

    const gold = this.getGold(character);
    character.gold += gold;

    text += __("\n- %d gold", gold);

    const scales = this.getScales();
    character.scales += scales;

    text += __("\n- %d Dragon %s!", scales, Text.pluralize('Scale', scales));

    if (character.party) {
      text += await character.party.addChestSpoils(character);
    }

    return text;
  }

  /**
   * Get the loot that is contained in the chest.
   *
   * @param {Character} character - The character looting the chest.
   *
   * @return {array}
   */
  getLoot(character) {
    return character.location.getCursedChestLoot(character).chooseLoot();
  }

  /**
   * Get the gold that is contained in the chest.
   *
   * @param {Character} character - The character looting the chest.
   *
   * @return {integer}
   */
  getGold(character) {
    const min = character.level * 7;
    const max = character.level * 10;

    return Random.between(min, max);
  }

  /**
   * Get the number of Dragon Scales in this chest.
   *
   * @return {integer}
   */
  getScales() {
    return Random.getWeighted([
      { 'weight': 50, value: 1 },
      { 'weight': 30, value: 2 },
      { 'weight': 20, value: 3 },
    ]);
  }

  /**
   * Leave it alone...
   *
   * @param {Character} character - The character performing the action.
   *
   * @return {string} The updated message title.
   */
  leaveIt(character) {
    character.track('Cursed Chest', {
      method: 'Leave it'
    });

    return __("Deciding that discretion is the better part of valour, you leave the glowing, evil chest behind you and continue onward.");
  }
}

module.exports = CursedChestEncounter;