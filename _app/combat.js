"use strict";

const Actions     = require('slacksimple').Actions;
const Text        = require('@util/text');
const Random      = require('@util/random');
const Arr         = require('@util/arr');
const Items       = require('@app/content/items').Items;
const Attachments = require('slacksimple').Attachments;
const Fields      = require('slacksimple').Fields;
const { sprintf } = require("sprintf-js");

const COLORS               = require('@constants').COLORS;
const CHARACTER_STATE      = require('@constants').CHARACTER_STATE;
const FLAGS                = require('@constants').FLAGS;
const PROPERTIES           = require('@constants').PROPERTIES;
const STATS                = require('@constants').STATS;
const STD_DELAY            = require('@constants').STD_DELAY;
const FIGHT_TIMED_STATUSES = require('@constants').FIGHT_TIMED_STATUSES;
const FIGHT_ACTIONS        = require('@constants').FIGHT_ACTIONS;
const RECOVER_AP           = require('@constants').RECOVER_AP;

class Combat {
  /**
   * Get the actions for this combat.
   *
   * @param {Character} character - The character to get actions for.
   *
   * @return {array}
   */
  static getActions(character) {
    let actions = new Actions();
    if (character.hasFlag(FLAGS.STUNNED_TURNS)) {
      actions.addAction(Combat.getDoNothingButton(character));
    }
    else if (character.hasFlag(FLAGS.FRENZY_TURNS)) {
      actions.addAction(Combat.getFrenzyButton(character));
    }
    else {
      actions.addAction(Combat.getAttackButton(character));
      actions.addAction(Combat.getDefendButton(character));
      actions.addAction(Combat.getCastButton(character));
      actions.addAction(Combat.getItemButton(character));
      actions.addAction(Combat.getRunButton(character));
    }

    actions = character.profession.modifyActions(character, actions);
    actions = character.enemy.modifyActions(character, actions);

    return actions;
  }

  /**
   * Get the button for doing nothing.
   *
   * @param {Character} character - The character needing the button.
   *
   * @return Button
   */
  static getDoNothingButton(character) {
    return Actions.getButton("Do Nothing", "fight_action", { params: { action: FIGHT_ACTIONS.DO_NOTHING } });
  }

  /**
   * Get the button for frenzying.
   *
   * @param {Character} character - The character needing the button.
   *
   * @return Button
   */
  static getFrenzyButton(character) {
    const frenzyText = character.getFlag(FLAGS.FRENZY_TURNS) > 1 ? "Attack!" : "ATTACK!!!";
    return Actions.getButton(frenzyText, "fight_action", { params: { action: FIGHT_ACTIONS.ATTACK } });
  }

  /**
   * Get the button for attacking.
   *
   * @param {Character} character - The character needing the button.
   *
   * @return Button
   */
  static getAttackButton(character) {
    if (character.hasFlag(FLAGS.IS_JAMMED)) {
      return Actions.getButton("Clear Jam", "fight_action", { params: { action: FIGHT_ACTIONS.CLEAR_JAM } });
    }
    else if (character.weapon.needsReloading(character)) {
      return Actions.getButton("Reload", "fight_action", { params: { action: FIGHT_ACTIONS.RELOAD } });
    }

    return Actions.getButton("Attack [+1]", "fight_action", { params: { action: FIGHT_ACTIONS.ATTACK }, style: 'primary' });
  }

  /**
   * Get the button for defending.
   *
   * @param {Character} character - The character needing the button.
   *
   * @return Button
   */
  static getDefendButton(character) {
    const style = character.hasFlag(FLAGS.DAZED_TURNS) ? 'danger' : 'primary';
    return Actions.getButton("Defend [+3]", "fight_action", { params: { action: FIGHT_ACTIONS.DEFEND }, style });
  }

  /**
   * Get the button for casting magic.
   *
   * @param {Character} character - The character needing the button.
   *
   * @return Button
   */
  static getCastButton(character) {
    if (character.knownSpells.length) {
      const style = (character.stamina === 0 || character.hasFlag(FLAGS.CANNOT_CAST)) ? 'danger' : 'default';
      return Actions.getButton("Cast [-1]", "fight_action", { params: { action: FIGHT_ACTIONS.CAST }, style });
    }

    return false;
  }

  /**
   * Get the button for using an item.
   *
   * @param {Character} character - The character needing the button.
   *
   * @return Button
   */
  static getItemButton(character) {
    const style = character.stamina > 0 ? 'default' : 'danger';
    return Actions.getButton("Item [-1]", "fight_action", { params: { action: FIGHT_ACTIONS.ITEMS }, style });
  }

  /**
   * Get the button for running.
   *
   * @param {Character} character - The character needing the button.
   *
   * @return Button
   */
  static getRunButton(character) {
    return Actions.getButton("Run", "fight_action", { params: { action: FIGHT_ACTIONS.RUN } });
  }

  /**
   * Get any fields to display with the message.
   *
   * @param {Character} character - The character to get fields for.
   *
   * @return {array}
   */
  static getFields(character) {
    const enemy  = character.enemy;

    let fields = [];

    let characterExtra = [];
    let enemyExtra     = [];

    if (character.hasFlag(FLAGS.STUNNED_TURNS)) {
      characterExtra.push('Stunned');
    }

    characterExtra = character.weapon.addCombatExtraFieldInfo(character, characterExtra);

    const characterValue = `HP: ${character.hp}/${character.maxHp}, MP: ${character.mp}/${character.maxMp}\nStamina: ${Combat.getStaminaIndicators(character)}`
      + (characterExtra.length > 0 ? `\n${characterExtra.join(", ")}` : '');

    fields.push({
      title: "You",
      value: characterValue,
      short: true
    });

    const enemyValue = enemy.getDisplayHp(character)
      + (enemyExtra.length > 0 ? `\n${enemyExtra.join(", ")}` : '');

    fields.push({
      title: enemy.getDisplayName(character),
      value: enemyValue,
      short: true
    });

    return fields;
  }

  /**
   * Get the Stamina indicators to display for this character.
   *
   * @param {Character} character - The character to get the Stamina indicators for.
   *
   * @return {string}
   */
  static getStaminaIndicators(character) {
    let indicators = '';

    for (let blackCircles = 0; blackCircles < character.stamina; blackCircles++) {
      indicators += ':black_circle:';
    }
    for (let whiteCircles = character.stamina; whiteCircles < character.getMaxStamina(); whiteCircles++) {
      indicators += ':white_circle:';
    }

    return indicators;
  }

  /**
   * Perform a single fight round.
   *
   * @param {object} actionInfo - Information about the action taken by the character.
   * @param {Character} character - The character doing the fighting.
   */
  static fight(actionInfo, character) {
    let messages      = [];
    let enemy         = character.enemy;
    let fightFinished = false;

    let enemyFightAction = enemy.chooseFightAction(character);

    messages = character.doFightTurnStart(messages);

    // Perform character, pet, and party actions
    messages = messages.concat(character.doFightAction(actionInfo));
    messages = Arr.concatPopulated(messages, character.pet.doPetAction(character));

    if (character.party) {
      messages = Arr.concatPopulated(messages, character.party.doPartyAction(character));
    }

    if (enemy.isFightActionForced()) {
      enemyFightAction = enemy.getForcedFightAction();
    }
    // If the fight action is no longer possible due to character actions, pick a new one
    else if ( ! enemy.isFightActionPossible(character, enemyFightAction)) {
      enemyFightAction = enemy.chooseFightAction(character);
    }

    // If enemy is dead
    if (enemy.isDead()) {
      // Some character actions can do self-damage, is the character dead?
      if (character.isDead()) {
        this.doFightFailure(character, messages);
      }
      else {
        messages = this.doFightSuccess(character, messages);
      }

      fightFinished = true;
    }
    // If enemy is alive and we're still fighting (i.e. haven't run away)
    else if (character.state === CHARACTER_STATE.FIGHTING) {
      messages = messages.concat(enemy.doFightAction(enemyFightAction, character));

      // If character is dead
      if (character.isDead()) {
        this.doFightFailure(character, messages);
        fightFinished = true;
      }
      // But what if enemy self-damages to death?
      else if (enemy.isDead()) {
        messages = this.doFightSuccess(character, messages);
        fightFinished = true;
      }
    }

    // Combatants do postround actions
    if ( ! character.isDead()) {
      messages = Arr.concatPopulated(messages, character.doPostRoundActions(enemy));
    }
    if ( ! enemy.isDead()) {
      messages = Arr.concatPopulated(messages, enemy.doPostRoundActions(character));
    }

    // Final check for character/enemy death after postround actions
    if ( ! fightFinished) {
      if (character.isDead()) {
        this.doFightFailure(character, messages);
      }
      else if (enemy.isDead()) {
        messages = this.doFightSuccess(character, messages);
      }
      else {
        // If either character or enemy is ranged, display that.
        if (character.isAtRange(enemy)) {
          messages.push(`${enemy.getDisplayName(character)} ${enemy.isAre} not in melee range.`);
        }

        messages = character.doFightTurnEnd(messages);
      }
    }

    // Build message info, add message colour and messages
    // Messages are the full text of Look if fight ongoing, otherwise preText
    let info = { delay: STD_DELAY };
    if (character.hp === 0) {
      info.color = COLORS.DANGER;
      info.preText = messages.join("\n");
    }
    else if (enemy.isDead()) {
      info.color = COLORS.GOOD;
      info.preText = messages.join("\n");
    }
    else {
      info.color = COLORS.WARNING;
      info.message = messages.join("\n");
    }

    if ( ! character.hasFlag(FLAGS.IN_CUTSCENE)) {
      const Commands = require('@app/content/commands').Commands;
      const command = Commands.new('look', character, { info });
      command.execute();
    }
  }

  /**
   * Perform a standard attack, and send back the messages resulting from it.
   *
   * @param {Character} character - The character performing the attack.
   * @param {string} message - A message to display for this attack.
   * @param {integer} forceAttacks - A number of attacks to force to happen.  Useful for limiting to 1.
   * @param {float} multiplier - A multiplier to apply to the attack damage.
   * @param {boolean} returnDamage - If we should return damage done as well as attack messages.
   * @param {array} attackProperties - The properties of the attack happening.
   *
   * @return {array}
   */
  static doAttack(character, {
    message = ":angry: You attack, dealing %s damage to %s.%s",
    dodgeMessage = ":dash: You attack %s, but they dodge your attack!",
    missMessage = ":dash: You attack %s, but miss!",
    forceAttacks = false,
    multiplier = 1,
    returnDamage = false
  } = {}, attackProperties = character.weapon.properties ) {
    let messages = [];
    let damage   = 0;
    let enemy    = character.enemy;

    // If either player or enemy is ranged and weapon isn't ranged, close distance instead
    if ( ! attackProperties.includes(PROPERTIES.RANGED_ATTACK)) {
      if (character.isAtRange(enemy)) {
        // If can close distance, do so
        if (character.canCloseDistance(enemy) && enemy.canCloseDistance(character)) {
          character.clearFlag(FLAGS.IS_RANGED);
          enemy.clearFlag(FLAGS.IS_RANGED);
          messages = [`${enemy.getDisplayName(character)} ${enemy.isAre} too far away to reach, so you close the distance to them instead.`];
          return returnDamage
            ? { damage: 0, messages }
            : messages;
        }
        // If can't close distance, return reason why
        else {
          let reasons = `${character.getCloseDistanceFailureMessage(enemy)}\n${enemy.getCloseDistanceFailureMessage(character)}`;
          return returnDamage
            ? { damage: 0, messages: [reasons.trim()] }
            : [reasons.trim()];
        }
      }
    }

    const attacks = character.weapon.getAttacks(character, forceAttacks);
    character.weapon.consumeAmmo(character, attacks);

    if (attacks === 0) {
      messages = ["You're out of ammo."];
      return returnDamage
        ? { damage: 0, messages }
        : messages;
    }

    for (let attackCount = 0; attackCount < attacks; attackCount++) {
      const attackInfo = character.getAttackInfo(enemy, attackProperties);

      // Dodged?  No damage!
      if (attackInfo.didDodge) {
        messages.push(__(dodgeMessage, enemy.getDisplayName(character)));
      }
      // Missed?  No damage!
      else if (attackInfo.didMiss) {
        messages.push(missMessage, enemy.getDisplayName(character));
      }
      // Otherwise, enemy got hurt
      else {
        damage = Math.ceil(attackInfo.damage * multiplier);
        const critText   = attackInfo.didCrit ? " _Critical hit!_" : '';
        const attackText = damage > 0 ? `*${damage}*` : "no";
        enemy.decreaseHp(damage);
        messages.push(sprintf(message, attackText, enemy.getDisplayName(character), critText));
      }

      messages = messages.concat(attackInfo.extraMessages);
    }

    return returnDamage
      ? { damage, messages }
      : messages;
  }

  /**
   * Attempt to run away.
   *
   * @param {Character} character - The character attempting to run.
   *
   * @return {array}
   */
  static doRun(character) {
    let messages = [];

    // Better chance to run away against lower-level enemies
    let chance = 0;
    if (character.enemy.level > character.level) {
      chance = 80;
    }
    else if (character.enemy.level < character.level) {
      chance = 40;
    }
    else {
      chance = 60;
    }

    // If character successfully runs away
    if (Random.between(0, 100) < chance) {

      character.state = CHARACTER_STATE.IDLE;
      character.increaseStat(STATS.FIGHTS_ESCAPED);

      messages = this.doFightRun(character, messages);

      messages.push(":sweat_smile: Taking advantage of a hectic and confusing moment in battle, you flee!");
    }
    else {
      messages.push(":cry: You try to escape, but are blocked at every turn!");
    }

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
  static doFightWrapUp(character, messages) {
    return character.doFightWrapUp(messages);
  }

  /**
   * Perform all the actions that happen when a fight ends, regardless of win/loss.
   *
   * @param {Character} character - The character involved in the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  static doFightEnd(character, messages) {
    character.track("Fight End", {
      enemy: character.enemy.type
    });

    character.clearAllTimers();
    character.stamina = 0;

    messages = character.doFightEnd(messages);

    for (let status of FIGHT_TIMED_STATUSES) {
      character.decrementFlag(status);
    }

    character.clearFlag(FLAGS.IS_RANGED);
    character.enemy.clearFlag(FLAGS.IS_RANGED);

    return messages;
  }

  /**
   * Do any extra actions required when running.
   *
   * @param {Character} character - The character doing the running.
   * @param {array} message - The previously-generated messages.
   *
   * @return {array}
   */
  static doFightRun(character, messages) {
    character.track("Fight Run");

    messages = this.doFightWrapUp(character, messages);
    messages = this.doFightEnd(character, messages);
    messages = character.doFightRun(messages);

    return messages;
  }

  /**
   * Character won!  Celebrate and add loot and XP and such.
   *
   * @param {Character} character - The character that won the fight.
   * @param {array} messages - The existing fight messages.
   *
   * @return {array} The modified messages.
   */
  static doFightSuccess(character, messages) {
    character.track("Fight Success");

    messages = this.doFightWrapUp(character, messages);

    const enemy = character.enemy;

    character.increaseStat(STATS.FIGHTS_WON);
    character.increaseStat(STATS.ENEMIES_KILLED, 1, enemy.type);

    character.state = CHARACTER_STATE.IDLE;

    const sp = enemy.getSp(character);
    character.profession.addSp(sp);

    const xp = ('true' === _.get(process.env, 'GAIN_XP', 'true'))
      ? enemy.getXp(character)
      : 0;
    const levelUpText = character.addXp(xp);

    const spText = this.getSpText(sp, character);
    const xpText = xp > 0 ? `${xp} XP (${character.getRequiredToNextLevel()} to level up)` : "no XP (enemy is too low level)";

    messages.push(`:grinning: ${enemy.getDisplayName(character)} died! You earned ${xpText}, and ${spText}. You check their remains and find:`);

    // Calculate gold and loot this enemy drops
    let goldWarningText = false;
    const gold = enemy.getGold(character);
    let loot = character.location.getLoot(character, enemy).chooseLoot();

    // Can't hold all these golds!
    if (gold > 0 && character.gold + gold >= character.getMaxGold()) {
      goldWarningText = `:money_with_wings: You try to gather all the gold you found, but it's just *tooo* much!  You can only hold ${character.getMaxGold().toLocaleString(character.locale)} gold.  Maybe visit the Exchange and pick up some Alchemy Catalysts for some enhancement flasks?`;
    }
    // Warn character is within 10%
    else if (gold > 0 && character.gold + gold >= character.getMaxGold() * 0.9) {
      goldWarningText = `:money_with_wings: Wow, gold is heavy!  You've nearly reached your ${character.getMaxGold().toLocaleString(character.locale)} gold limit!  Maybe visit the Exchange and pick up some Alchemy Catalysts for some enhancement flasks?`;
    }

    // Add gold, scales and loot
    character.gold += gold;
    character.scales += enemy.scales;
    character.increaseStat(STATS.GOLD_LOOTED, gold);

    for (let entry of loot) {
      entry.quantity = character.inventory.add(entry.type, entry.quantity);
    }

    // Strip out all loot that has no quantity (either 0x dropped or max quantity hit)
    loot = loot.filter((loot) => {
      return loot.quantity > 0;
    });

    enemy.onFightLootAdded(character, gold, enemy.scales, loot);
    messages.push(this._getLootText(gold, enemy.scales, loot));

    if (goldWarningText) {
      messages.push(goldWarningText);
    }

    // Add any potential level up text after all the loot
    messages = messages.concat(levelUpText);

    messages = this.doFightEnd(character, messages);

    messages = character.doFightSuccess(messages);

    return messages;
  }

  /**
   * Get the text indicating how much SP you gained.
   *
   * @param {integer} sp - The amount of SP gained.
   * @param {Character} character - The character gaining the SP.
   *
   * @return {string}
   */
  static getSpText(sp, character) {
    return (0 === sp) ? character.getZeroSpReason() : `${sp} SP`;
  }

  /**
   * Character lost!
   *
   * @param {Character} character - The character that lost.
   * @param {array} messages - Any messages that have happened so far.
   */
  static doFightFailure(character, messages) {
    const slashbot = character.slashbot;

    character.track("Fight Failure");

    messages = this.doFightWrapUp(character, messages);

    character.increaseStat(STATS.FIGHTS_LOST);

    character.state = CHARACTER_STATE.WOUNDED;
    character.setFlag(FLAGS.IN_CUTSCENE);

    messages = this.doFightEnd(character, messages);

    messages = character.doFightFailure(messages);

    let actions = new Actions();
    actions.addButton(`Pay ${RECOVER_AP} AP`, 'recover', { params: { payWith: 'ap' } });
    actions.addButton(`Pay ${character.getRecoveryCost()} gold`, 'recover', { params: { payWith: 'gold' } });

    // Characters to tell the story
    const narratorChar = slashbot.getNpc('narrator', character);
    const phaeraChar = slashbot.getNpc('phaera', character);

    let narratorStory = [];
    let phaeraStory   = [];
    let phaeraQuestion = '';

    slashbot.say(messages.join("\n"), narratorChar, { typing: true });

    if (character.getStat(STATS.FIGHTS_LOST) === 1) {
      narratorStory = [
        "Your wounds overcome you, and you fall, descending into blackness.  For an indeterminate amount of time, you are alone with your thoughts and regrets.",
        "You're not sure when, but eventually you notice the darkness around you has begun to fade. Flames glow softly at the edge of your vision.  They continue to grow until with a rush of heat, Phaera stands before you.",
      ];
      phaeraStory = [
        "Oh, my child.  I had hoped not to see you like this so soon.  Still, this is one of the hazards of the task I have set you.",
        "A smart warrior makes use of all available to them.  Consider the Blacksmith shop in town - they may have tools that will aid you in your fight.",
        "I can return you to life, but all things have a price.  With no price, you would not learn, and if you do not learn, you will not overcome the trials in front of you.",
      ];
      phaeraQuestion = "So I ask you: Would you trade your time or your wealth to rejoin the fight?";
    }
    else {
      narratorStory = [
        "Your wounds overcome you, and you fall, descending into blackness.  For an indeterminate amount of time, you are alone with your thoughts and regrets.",
        "As before, Phaera eventually joins you, her flames warming and reassuring you.",
      ];
      phaeraQuestion = "Do not despair.  This is just another learning experience.\n\nWhat price would you pay, my champion?";
    }

    for (let idx = 0; idx < narratorStory.length; idx++) {
      slashbot.say(narratorStory[idx], narratorChar, { messageDelay: (idx + 1) * 5, typing: true });
    }
    for (let idx = 0; idx < phaeraStory.length; idx++) {
      slashbot.say(phaeraStory[idx], phaeraChar, { messageDelay: (narratorStory.length + idx + 1) * 5, typing: true });
    }

    let fields = new Fields();
    fields.add("AP:", character.ap, true);
    fields.add("Gold:", character.gold, true);

    // Button is required to recover
    slashbot.say('', phaeraChar, {
      attachments: Attachments.one({
        title: phaeraQuestion,
        fields,
        actions,
      }),
      messageDelay: (narratorStory.length + phaeraStory.length + 1) * 5
    });
  }

  /**
   * Get the text to add to the messages to describe the gold and loot obtained from a fallen enemy.
   *
   * @param {integer} gold - The amount of gold gained.
   * @param {integer} scales - The number of scales added.
   * @param {array} loot - The loot gained.
   *
   * @return {string}
   */
  static _getLootText(gold, scales, loot) {
    let text = [];

    if (gold > 0) {
      text.push(`${gold} gold`);
    }

    if (scales > 0) {
      text.push(`${scales} ${Text.pluralize("scale", scales)}`);
    }

    if (loot.length > 0) {
      for (let itemData of loot) {
        const item = Items.new(itemData.type);
        const name = Text.pluralize(item.getDisplayName(), itemData.quantity);

        text.push(item.shouldBold
          ? `*${itemData.quantity}x ${name}*`
          : `${itemData.quantity}x ${name}`
        );
      }
    }

    return text.length > 0 ? ("\n>" + text.join(', ')) : "...Nothing.  Drat.";
  }
}

module.exports = Combat;
