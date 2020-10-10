"use strict";

let collection = {};
let names      = {};

const { sprintf } = require("sprintf-js");
const Log         = require('@util/log');
const Combatant   = require('@app/combatant');
const Random      = require('@util/random');
const Files       = require('@util/files');
const Loot        = require('@app/loot').Loot;
const Content     = require('@app/content')(collection, names);

const FLAGS              = require('@constants').FLAGS;
const PROPERTIES         = require('@constants').PROPERTIES;
const ENEMY_XP_PER_LEVEL = require('@constants').ENEMY_XP_PER_LEVEL;

const PET_AISLING        = 'equipment-pets-aisling';

/**
 * Base enemy class.
 */
class Enemy extends Combatant {
  constructor(info) {
    super(info);

    this.type         = _.get(info, 'type', '');
    this._displayName = _.get(info, 'displayName', '');
    this.isAre        = _.get(info, 'isAre', 'is');
    this.aliases      = _.get(info, 'aliases', []);
    this._description = _.get(info, 'description', '');
    this._critBonus   = _.get(info, 'critBonus', 1.5);

    this._levelBonus = _.get(info, 'levelBonus', 0);
    this.isBoss      = _.get(info, 'isBoss', false);

    this.stats = { base: {}, perLevel: {} };

    this.stats.base.maxHp     = _.get(info, 'stats.base.maxHp', 50);
    this.stats.base.minDamage = _.get(info, 'stats.base.minDamage', 2);
    this.stats.base.maxDamage = _.get(info, 'stats.base.maxDamage', 4);
    this.stats.base.force     = _.get(info, 'stats.base.force', 5);
    this.stats.base.defence   = _.get(info, 'stats.base.defence', 1);
    this.stats.base.crit      = _.get(info, 'stats.base.crit', 5);
    this.stats.base.dodge     = _.get(info, 'stats.base.dodge', 5);
    this.stats.base.goldMin   = _.get(info, 'stats.base.goldMin', 6);
    this.stats.base.goldMax   = _.get(info, 'stats.base.goldMax', 10);

    this.stats.perLevel.maxHp     = _.get(info, 'stats.perLevel.maxHp', 25);
    this.stats.perLevel.minDamage = _.get(info, 'stats.perLevel.minDamage', 1);
    this.stats.perLevel.maxDamage = _.get(info, 'stats.perLevel.maxDamage', 1);
    this.stats.perLevel.force     = _.get(info, 'stats.perLevel.force', 0.75);
    this.stats.perLevel.defence   = _.get(info, 'stats.perLevel.defence', 1);
    this.stats.perLevel.crit      = _.get(info, 'stats.perLevel.crit', 0);
    this.stats.perLevel.dodge     = _.get(info, 'stats.perLevel.dodge', 0);
    this.stats.perLevel.goldMin   = _.get(info, 'stats.perLevel.goldMin', 2);
    this.stats.perLevel.goldMax   = _.get(info, 'stats.perLevel.goldMax', 3);

    this._loot = _.get(info, 'loot', new Loot());
    this.scales = _.get(info, 'scales', 0);

    this.properties = _.get(info, 'properties', []);
    this.attackProperties = _.get(info, 'attackProperties', [
      PROPERTIES.IS_ATTACK,
    ]);

    this.fightActions = _.get(info, 'fightActions', {});

    this.fightActionProperties = _.get(info, 'fightActionProperties', {});

    this._flags = _.get(info, 'flags', {});
    if ( ! this._flags) {
      this._flags = {};
    }
  }

  /**
   * Get the force value this enemy has.
   *
   * @return {integer}
   */
  get force() {
    return this._force;
  }

  /**
   * Set the force value for this enemy.
   *
   * @param {integer} force - The force to set.
   */
  set force(force) {
    this._force = force;
  }

  /**
   * Get the crit chance this character has.
   *
   * @return {integer}
   */
  get crit() {
    return this._crit;
  }

  /**
   * Set the crit value for this enemy.
   *
   * @param {integer} crit - The crit to set.
   */
  set crit(crit) {
    this._crit = crit;
  }

  /**
   * Get the defence value this character has.
   *
   * @return {integer}
   */
  get defence() {
    return this._defence;
  }

  /**
   * Set the defence value for this enemy.
   *
   * @param {integer} defence - The defence to set.
   */
  set defence(defence) {
    this._defence = defence;
  }

  /**
   * Get the dodge chance this character has.
   *
   * @return {integer}
   */
  get dodge() {
    return this._dodge;
  }

  /**
   * Set the dodge value for this enemy.
   *
   * @param {integer} dodge - The dodge to set.
   */
  set dodge(dodge) {
    this._dodge = dodge;
  }

  /**
   * Load an enemy from DB into a character.
   *
   * @param {Character} character - The character to load the enemy for.
   * @param {PromiseConnection} connection - The database connection to use.
   *
   * @return {Enemy}
   */
  static async load(character, connection) {
    const [rows, ] = await connection.query('SELECT * FROM enemies WHERE character_id = ?', [character.id]);

    if (rows.length === 0) {
      throw new Error(`No enemy loaded for character ID: '${character.id}'`);
    }

    let enemy = Enemies.new(rows[0].type);
    enemy._flags = rows[0].flags;
    enemy.setLevel(rows[0].level, character.location.getEnemyLevelBonus(enemy, character, rows[0].type));
    enemy.dbId   = rows[0].id;
    enemy.hp     = rows[0].hp;

    // Link back for access to stats and such
    enemy.character = character;

    return enemy;
  }

  /**
   * Save this enemy to the DB.
   *
   * @param {string} character_id - The ID of the character to save the enemy of.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async save(character_id, connection) {
    await connection.query('UPDATE enemies SET ? WHERE character_id = ?', [this.getDbFields(), character_id]);
  }

  /**
   * Get the fields to save the the database.
   *
   * @return {object}
   */
  getDbFields() {
    return {
      type: this.type,
      level: this.level,
      hp: this._hp,
      flags: JSON.stringify(this.getFlags()),
    };
  }

  /**
   * Get the display name of this enemy.
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getDisplayName(character) {
    return this._displayName;
  }

  /**
   * Whether to use "a" or "some" for the determiner.
   *
   * IMPORTANT: Includes space after word, so determiner can be omitted if necessary.
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getDeterminer(character) {
    return this.isAre === 'is' ? "a " : "some ";
  }

  /**
   * What to display after "You encountered " when starting a fight.
   *
   * @param {Character} character - The character encountering the enemy.
   *
   * @return {string}
   */
  getEncounterName(character) {
    return `${this.getDeterminer(character)}${this.getLevelName(character)}`;
  }

  /**
   * Get the HP display of this enemy.
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getDisplayHp(character) {
    return `HP: ${this.hp}/${this.maxHp}`;
  }

  /**
   * Get the level bonus for this character.
   *
   * @return {integer}
   */
  getLevelBonus() {
    return this._levelBonus;
  }

  /**
   * Get the name of the enemy including its level.
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getLevelName(character) {
    const bonusSign = this.getLevelBonus() > 0 ? "+" : (this.getLevelBonus() < 0 ? "-" : "");
    const level = this.isBoss ? "" : `L${this.level}${bonusSign} `;
    const bossSignifier = this.isBoss ? "☠️ " : "";

    return level + this.getDisplayName() + bossSignifier;
  }

  /**
   * Get the description for this enemy and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting enemy description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = this._description;

    if (this.hasFlag(FLAGS.IS_RANGED)) {
      description += `\n\n${this.getDisplayName(character)} ${this.isAre} not in melee range.`;
    }

    return description;
  }

  /**
   * Returns the loot this enemy is carrying.
   *
   * @param {Character} character - The character that is fighting this enemy.
   *
   * @return {object}
   */
  getLoot(character) {
    return this._loot;
  }

  /**
   * Get the crit bonus for this enemy.
   *
   * @param {Character} character - The character being attacked by this enemy.
   *
   * @return {float}
   */
  getCritBonus(character) {
    if ('tier_1-caravan_guard' === character.profession.type && character.profession.level >= 5) {
      return this._critBonus - 0.25;
    }

    return this._critBonus;
  }

  /**
   * Set this enemy to a specific level.
   *
   * @param {integer} level - The level to set them to.
   * @param {integer} levelBonus - A location-based level bonus to add/subtract.
   */
  setLevel(level, levelBonus = 0) {
    this.level = level;
    this._levelBonus += levelBonus;

    // First level only gets base stats
    let increaseBy = level + this.getLevelBonus() - 1;

    this.maxHp = this.stats.base.maxHp + Math.floor(increaseBy * this.stats.perLevel.maxHp);
    this._hp    = this.maxHp;

    this.minDamage = this.stats.base.minDamage + Math.floor(increaseBy * this.stats.perLevel.minDamage);
    this.maxDamage = this.stats.base.maxDamage + Math.floor(increaseBy * this.stats.perLevel.maxDamage);

    this._force   = this.stats.base.force + Math.floor(increaseBy * this.stats.perLevel.force);
    this._crit    = this.stats.base.crit + Math.floor(increaseBy * this.stats.perLevel.crit);
    this._defence = this.stats.base.defence + Math.floor(increaseBy * this.stats.perLevel.defence);
    this._dodge   = this.stats.base.dodge + Math.floor(increaseBy * this.stats.perLevel.dodge);

    this.goldMin = this.stats.base.goldMin + Math.floor(increaseBy * this.stats.perLevel.goldMin);
    this.goldMax = this.stats.base.goldMax + Math.floor(increaseBy * this.stats.perLevel.goldMax);
  }

  /**
   * Gets the XP awarded for defeating this enemy.
   * Decreases for higher-level characters.
   *
   * @param {Character} character - The character defeating this enemy.
   *
   * @return {integer}
   */
  getXp(character) {
    const baseXp = ENEMY_XP_PER_LEVEL * this.level;
    const diff   = character.level - this.level;

    if (diff <= 0) {
      return baseXp;
    }

    switch (diff) {
      case 1: return Math.ceil(0.8 * baseXp);
      case 2: return Math.ceil(0.6 * baseXp);
      case 3: return Math.ceil(0.4 * baseXp);
      default: return 0;
    }
  }

  /**
   * Get the gold awarded for defeating this enemy.
   *
   * @param {Character} character - The character defeating this enemy.
   *
   * @return {integer}
   */
  getGold(character) {
    // Aisling eats all your gold!
    if (character.pet.type === PET_AISLING) {
      return 0;
    }

    return Random.between(this.goldMin, this.goldMax);
  }

  /**
   * Get the SP awarded for defeating this enemy.
   * Decreases for lower-level enemies.
   * Max of 5, min of 3.
   * Doubled if character has Well Rested buff.
   *
   * @param {Character} character - The character defeating this enemy.
   *
   * @return {integer}
   */
  getSp(character) {
    let sp = Math.max(3, Math.min(5, 5 - (character.level - this.level)));

    // Aisling grants +1 SP
    if (character.pet.type === PET_AISLING) {
      sp += 1;
    }

    // Having a boost grants +1 SP
    if (character.hasBoost('party-1_sp')) {
      sp += 1;
    }

    // Being well-rested doubles your SP
    character.spWasDoubled = false;
    if (character.hasFlag(FLAGS.WELL_RESTED_TURNS)) {
      sp *= 2;
      character.spWasDoubled = true;
    }

    return sp;
  }

  /**
   * Is this enemy tired after performing a furious attack?
   *
   * @return {boolean}
   */
  isTired() {
    return this.hasFlag(FLAGS.TIRED_TURNS);
  }

  /**
   * Gives enemies a chance to modify a character's action buttons.
   *
   * @param {Character} character - The character to modify the action buttons for.
   * @param {Actions} actions - The action buttons to modify.
   *
   * @return {Actions}
   */
  modifyActions(character, actions) {
    return actions;
  }

  /**
   * Gives enemies a chance to modify a character's skill action buttons.
   *
   * @param {Character} character - The character to modify the skill action buttons for.
   * @param {Actions} actions - The skill action buttons to modify.
   *
   * @return {Actions}
   */
  modifySkillActions(character, actions) {
    return actions;
  }

  /**
   * A character is performing an action specific to this enemy.
   *
   * @param {Character} character - The character performing the action.
   * @param {string} type - The type of action being performed.
   * @param {object} info - All info about the action selected.
   *
   * @return {array}
   */
  doCharacterFightAction(character, type, info) {
    return [];
  }

  /**
   * Can a character perform an action specific to this enemy?
   *
   * @param {Character} character - The character performing the action.
   * @param {string} type - The type of action being performed.
   *
   * @return {boolean}
   */
  canDoCharacterFightAction(character, type) {
    return true;
  }

  /**
   * A helper to handle attacks that only do something interesting if they succeed.
   *
   * @param {Character} character - The character being attacked.
   * @param {function} success - The function to call if the attack succeeds.
   * @param {string} dodgeText - The text to display when dodging.
   * @param {string} missText - The text to display when missing.
   * @param {array} attackProperties - The properties of the attack.
   *
   * @return {array}
   */
  attackHelper(character, success, dodgeText = ":dash: %s attacks, but you dodge!", missText = "%s attacks, but misses!", attackProperties = []) {
    const attackInfo = this.getAttackInfo(character, attackProperties);

    if (attackInfo.didDodge) {
      return [sprintf(dodgeText, this.getDisplayName(character))];
    }
    else if (attackInfo.didMiss) {
      return [sprintf(missText, this.getDisplayName(character))];
    }

    return success(attackInfo).concat(attackInfo.extraMessages);
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
   * Special actions to take when the fight with this enemy is complete, regardless of win/loss.
   *
   * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
   * the action fight message.
   *
   * @param {Character} character - The character who was in the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(character, messages) {
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
  doFightRun(character, messages) {
    return messages;
  }

  /**
   * Special actions to take when this enemy has been beaten.
   *
   * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
   * the action fight message.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    return messages;
  }

  /**
   * Special actions to take when this enemy has won.
   *
   * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
   * the action fight message.
   *
   * @param {Character} character - The character who lost the fight.
   *
   * @return array
   */
  doFightFailure(character, messages) {
    return messages;
  }

  /**
   * Called when loot is added after a fight.
   *
   * @param {Character} character - The character who the loot was awarded to.
   * @param {integer} gold - The gold added.
   * @param {integer} scales - The number of scales added.
   * @param {array} loot - The loot added.
   */
  onFightLootAdded(character, gold, scales, loot) { }

  /**
   * Get the fight actions for this enemy.
   *
   * @param {Character} character - The character this enemy is fighting.
   * @param {object} actions - Actions passed in from mixed-in actions.
   *
   * @return {object}
   */
  getFightActions(character, actions = {}) {
    // Overwrite default action amounts with enemy-specified ones
    for (const action in this.fightActions) {
      if (_.isUndefined(actions[action])) {
        actions[action] = this.fightActions[action];
      }
    }

    // If no default attack, add enough to add up to 100
    if (_.isUndefined(actions.doAttack)) {
      let total = 0;
      for (const action in actions) {
        total += actions[action];
      }

      if (total < 100) {
        actions.doAttack = 100 - total;
      }
    }

    return actions;
  }

  /**
   * If this fight action is possible to take at this time.
   *
   * @param {Character} character - The character this enemy is fighting.
   * @param {object} action - The action to check.
   *
   * @return {boolean}
   */
  isFightActionPossible(character, action) {
    return Object.keys(this.getFightActions(character)).includes(action);
  }

  /**
   * Return the fight actions of this enemy as a weighted array for Random.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {array}
   */
  getWeightedFightActions(character) {
    const fightActions = this.getFightActions(character);

    let actions = [];
    for (const action in fightActions) {
      actions.push({ value: action, weight: fightActions[action] });
    }

    return actions;
  }

  /**
   * According to this enemy's predilictions, pick a fight action, then do it!  Default to simple attack
   *
   * @param {string} fightAction - The action to perform.
   * @param {Character} character - The character being attacked.
   *
   * @return {array} Messages generated.
   */
  doFightAction(fightAction, character) {
    try {
      // If stunned, can do no actions
      if (this.hasFlag(FLAGS.STUNNED_TURNS)) {
        return this.beStunned(character);
      }

      // Enemy closes the distance instead of their action
      if (this.isMeleeAttackingAtRange(character, fightAction)) {
        if (this.hasFlag(FLAGS.WINDWALL_TURNS)) {
          return this.blow(character);
        }

        // If can close distance, do so
        if (this.canCloseDistance(character) && character.canCloseDistance(this)) {
          this.clearFlag(FLAGS.IS_RANGED);
          character.clearFlag(FLAGS.IS_RANGED);
          return [`${this.getDisplayName(character)} ${this.isAre} too far away to reach you.  ${this.isAre === 'is' ? "It rushes" : "They rush"} you to close the distance!`];
        }
        // If can't close distance, return reason why
        else {
          let reasons = `${this.getCloseDistanceFailureMessage(character)}\n${character.getCloseDistanceFailureMessage(this)}`;
          return [reasons.trim()];
        }
      }

      return this[fightAction](character);
    }
    catch (error) {
      Log.error(`Could not perform fight action '${fightAction}'.`);
      throw error;
    }
  }

  /**
   * If the action in question is a melee attack, but either opponent is at range.
   *
   * @param {Character} character - The character being attacked.
   * @param {string} fightAction - The action being performed.
   *
   * @return {boolean}
   */
  isMeleeAttackingAtRange(character, fightAction) {
    const actionProperties = this.buildActionProperties(fightAction);

    // If the fight action is an attack
    if (actionProperties.includes(PROPERTIES.IS_ATTACK)) {
      // And either character is at range
      if (character.isAtRange(this)) {
        // And the fight action isn't a ranged attack, and enemy doesn't have a ranged attack
        if ( ! actionProperties.includes(PROPERTIES.RANGED_ATTACK) && ! this.properties.includes(PROPERTIES.RANGED_ATTACK)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Blow around an enemy that entered a Windwall spell.
   *
   * @param {Character} character - The character the cast the spell.
   *
   * @return {array} The messages generated.
   */
  blow(character) {
    const WindwallSpell = require('@content/spells/windwall');
    return WindwallSpell.blow(this, character);
  }

  /**
   * Builds action properties by combining the attack properties of this enemy as well as the
   * attack properties of the action.
   *
   * @param {string} fightAction - The fight action to combine properties with.
   *
   * @return {array}
   */
  buildActionProperties(fightAction) {
    return _.union(
      this.attackProperties,
      _.get(this.fightActionProperties, fightAction, [])
    );
  }

  /**
   * If a fight action is forced due to status effects.
   *
   * @return {boolean}
   */
  isFightActionForced() {
    return this.hasFlag(FLAGS.INFLAMED_TURNS) || this.hasFlag(FLAGS.ENRAGED_TURNS);
  }

  /**
   * Get any fight actions this enemy is forced to make.
   *
   * @return {string}
   */
  getForcedFightAction() {
    return "doAttack";
  }

  /**
   * Choose the fight action for this enemy.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {string}
   */
  chooseFightAction(character) {
    return Random.getWeighted(this.getWeightedFightActions(character));
  }

  /**
   * Do a single enemy attack.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  doAttack(character) {
    return this.attackHelper(character, (attackInfo) => {
      let messages = [];
      const displayName = this.getDisplayName(character);

      if (character.hasFlag(FLAGS.IS_RIPOSTING)) {
        if ( ! character.isAtRange(this)) {
          attackInfo.damage = Math.ceil(attackInfo.damage / 2);
        }
      }

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : '';
      const attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";
      messages.push(`:frowning: ${displayName} attacks, dealing ${attackText} damage to you.${critText}`);
      character.decreaseHp(attackInfo.damage);

      if (character.hasFlag(FLAGS.IS_RIPOSTING)) {
        if ( ! character.isAtRange(this)) {
          this.decreaseHp(attackInfo.damage);
          messages.push(`:grinning: You block half of ${displayName}'s attack and riposte, dealing ${attackText} damage back to them!`);
          character.clearFlag(FLAGS.IS_RIPOSTING);
        }
        else {
          messages.push("You can't riposte while outside of melee range.");
        }
      }

      return messages;
    });
  }

  /**
   * Be stunned for a turn, taking no action.
   *
   * @param {Character} character - The opposing character.
   *
   * @return {array}
   */
  beStunned(character) {
    return [`${this.getDisplayName(character)} ${this.isAre} stunned and can do nothing this turn.`];
  }

  /**
   * After an attack has been performed, allow the attacker to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Combatant} defender - The defending combatant.
   *
   * @return {object}
   */
  doAttackerPostAttackProcessing(attackInfo, defender) {
    // If enemy is tired and character attacked cautiously, do no damage!
    if (this.isTired() && defender.hasFlag(FLAGS.IS_CAUTIOUS)) {
      attackInfo.damage = 0;
    }
    // If enemy has been disarmed, do only 50% damage
    else if (this.hasFlag(FLAGS.IS_DISARMED)) {
      attackInfo.damage = Math.ceil(attackInfo.damage / 2);
      this.clearFlag(FLAGS.IS_DISARMED);
    }

    return attackInfo;
  }

  /**
   * After an attack has been performed, allow the defender to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Combatant} attacker - The attacking combatant.
   *
   * @return {object}
   */
  doDefenderPostAttackProcessing(attackInfo, attacker) {
    return attackInfo;
  }
}

/**
 * Utility class for searching and creating new enemy objects.
 */
class Enemies extends Content {}

module.exports = {
  Enemy,
  Enemies
};

/**
 * @type array The collection of enemies.
 */
Files.loadContent(`${CONTENT_FILES_PATH}/enemies/`, `${CONTENT_FILES_PATH}/enemies/`, collection);

/**
 * @type object The names of the enemies, for quick reference.
 */
Files.getNames(collection, names);
