"use strict";

let collection = {};
let names      = {};
let types      = new Map();

const { sprintf } = require("sprintf-js");
const { Actions } = require('slacksimple');
const Log         = require('@util/log');
const Files       = require('@util/files');
const Content     = require('@app/content')(collection, names, types);
const Combat      = require('@app/combat');
const Gun         = require('@app/content/items/equipment/weapons/guns');
const { getLongAttributeName, getPropertyName, pluralize } = require('@util/text');

const {
  FLAGS,
  PROPERTIES,
  STATS,
  PROFESSIONS,
  LYCA_FORMS,
  STAMINA_INCREASE_FIGHT,
  STAMINA_INCREASE_DEFEND,
} = require('@constants');

const FLAG_OLD_PROFESSION = 'old_profession';

// Novice Support Skill
const SKILL_SOOTHE           = "soothe";
const STAMINA_SOOTHE         = 6;
const SOOTHE_HP_HEALED       = 10;
const TURNS_SOOTHED          = 5;
const COOLDOWN_FIGHTS_SOOTHE = 1;

// Bard Support Skill
const SKILL_FOCUS   = "focus";
const STAMINA_FOCUS = 1;

// Caravan Guard Support Skill
const SKILL_GUARD   = "guard";
const STAMINA_GUARD = 2;

// Mercenary Support Skill
const SKILL_EVADE   = "evade";
const STAMINA_EVADE = 2;

// Battle Witch Support Skill
const SKILL_QUICK_RELOAD   = 'quick_reload';
const STAMINA_QUICK_RELOAD = 2;

// Mist Dancer Support Skill
const SKILL_RIPOSTE   = 'riposte';
const STAMINA_RIPOSTE = 2;

// Gladiator Support Skill
const SKILL_RAGE           = 'rage';
const STAMINA_RAGE         = 4;
const RAGE_BONUS_INCREMENT = 5;

// Lyca Support Skill
const SKILL_BEAR           = 'bear';
const STAMINA_BEAR         = 6;
const FIGHTS_COOLDOWN_BEAR = 4;

/**
 * Base profession.
 */
class Profession {
  constructor(info) {
    this.type                           = _.get(info, 'type', '');
    this._displayName                   = _.get(info, 'displayName', '');
    this.aliases                        = _.get(info, 'aliases', []);
    this._description                   = _.get(info, 'description', '');
    this.details                        = _.get(info, 'details', '');
    this.adText                         = _.get(info, 'adText', '');
    this.difficulty                     = _.get(info, 'difficulty', 0);
    this.image                          = _.get(info, 'image', '');
    this._changeCost                    = _.get(info, 'changeCost', 0);
    this.maxSp                          = _.get(info, 'maxSp', 0);
    this.masteryDescription             = _.get(info, 'masteryDescription', '');
    this._masteryImprovementDescription = _.get(info, 'masteryImprovementDescription', '');
    this.spMastery                      = _.get(info, 'spMastery', 0);
    this.reqSpMastery                   = _.get(info, 'reqSpMastery', 0);
    this.supportSkill                   = _.get(info, 'supportSkill', '');
    this.trained                        = _.get(info, 'trained', {});
    this.loaded                         = false;

    this._sp     = 0;
    this.addedSp = 0;
    this.spSpent = 0;
  }

  /**
   * Get the SP for this profession.
   *
   * @return {integer}
   */
  get sp() {
    return this._sp;
  }

  /**
   * Set the SP for this profession.
   *
   * @param {integer} sp - The SP to set.
   */
  set sp(sp) {
    this._sp = sp;
  }

  /**
   * Add SP to this profession, saving the amount added for potential future use.
   *
   * @param {integer} sp - The amount of SP to add.
   */
  addSp(sp) {
    this._sp += sp;
    this.addedSp = sp;
  }

  /**
   * Load a profession from DB into a character, trying cache first.
   *
   * @param {Character} character - The character to load the profession for.
   * @param {string} type - The profession type to load.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  static async load(character, type, connection) {
    const [rows, ] = await connection.query('SELECT * FROM professions WHERE character_id = ? AND type = ?', [character.id, type]);

    if (rows.length === 0) {
      throw new Error(`Could not load "${type}" profession for character ID: '${character.id}'`);
    }

    let profession = Professions.new(Profession.getFullType(rows[0].type, character));
    profession.sp      = rows[0].sp;
    profession.spSpent = rows[0].sp_spent;
    profession.trained = profession.getTrained(rows[0], type, character);
    profession.loaded  = true;

    return profession;
  }

  /**
   * Certain professions have subtypes based on flags.
   *
   * @param {string} type - The main profession type.
   * @param {Character} character - The character being loaded.
   *
   * @return {string}
   */
  static getFullType(type, character) {
    const hasSubTypes = [PROFESSIONS.LYCA];

    if (hasSubTypes.includes(type)) {
      return character.hasFlag(FLAGS.PROFESSION_SUBTYPE)
        ? `${type}_${character.getFlag(FLAGS.PROFESSION_SUBTYPE)}`
        : type;
    }

    return type;
  }

  /**
   * Load and return a specific profession for a character.
   *
   * @param {Character} character - The character to load the profession for.
   * @param {string} professionType - The type of profession to load.
   *
   * @return {Profession}
   */
  static async loadSpecific(character, professionType) {
    let profession = Professions.new(professionType);

    const [rows, ] = await character.connection.query('SELECT * FROM professions WHERE character_id = ? AND type = ?', [character.id, professionType]);

    // Never used this profession yet?  Start with defaults!
    if (rows.length === 0) {
      profession.sp      = 0;
      profession.spSpent = 0;
      profession.trained = {};

      Log.warn(`Could not load ${professionType} for character #${character.id}.  This may be normal!`);

      // Otherwise, load that profession from the DB values
    }
    else {
      profession.sp      = rows[0].sp;
      profession.spSpent = rows[0].sp_spent;
      profession.trained = profession.getTrained(rows[0], professionType, character);
    }

    profession.loaded  = true;

    return profession;
  }

  /**
   * Load all professions for a character.
   *
   * @param {Character} character - The character to load professions for.
   *
   * @return {array}
   */
  static async list(character) {
    const [rows, ] = await character.connection.query('SELECT * FROM professions WHERE character_id = ?', [character.id]);

    let professions = [];
    for (let row of rows) {
      let profession = Professions.new(row.type);

      profession.sp      = row.sp;
      profession.spSpent = row.sp_spent;
      profession.trained = profession.getTrained(row, row.type, character);

      professions.push(profession);
    }

    return professions;
  }

  /**
   * Save a profession to the DB, and update the cache.
   *
   * @param {string} character_id - The ID of the character to save the profession of.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async save(character_id, connection) {
    const dbFields = this.getDbFields();
    dbFields.character_id = character_id;

    const [rows, ] = await connection.query(
      'SELECT id FROM professions WHERE character_id = ? AND type = ?', [
        character_id,
        this.type,
      ]);

    if (rows[0]) {
      await connection.query('UPDATE professions SET ? WHERE id = ?', [
        dbFields,
        rows[0].id
      ]);
    }
    else {
      await connection.query('INSERT INTO professions (??) VALUES (?)', [
        Object.keys(dbFields),
        Object.values(dbFields),
      ]);
    }
  }

  /**
   * Get the fields to save the the database.
   *
   * @return {object}
   */
  getDbFields() {
    return {
      type: this.type,
      sp: this.sp,
      sp_spent: this.spSpent,
      trained: JSON.stringify(this.trained),
    };
  }

  /**
   * Get the display name for this profession.
   *
   * @param {Character} character - The character getting the display name.
   *
   * @return {string}
   */
  getDisplayName(character) {
    return this._displayName;
  }

  /**
   * Get the description for this profession.
   *
   * @param {Character} character - The character getting the description.
   *
   * @return {string}
   */
  getDescription(character) {
    return this._description;
  }

  /**
   * If the character has met the requirements to switch to this profession.
   *
   * @param {Character} character - The character to check the requirements for.
   *
   * @return {boolean}
   */
  hasMetRequirements(character) {
    return character.gold > this.getCost(character);
  }

  /**
   * Get the error message that explains why the character has failed to mee the requirements.
   *
   * @param {Character} character - The character to get the error text for.
   *
   * @return {string}
   */
  getRequirementError(character) {
    return "You don't have enough money to change to this profession.";
  }

  /**
   * Get the skills this profession has trained.
   *
   * @param {array} dbRow - The database row to extract the trained skills from.
   * @param {string} type - The type of profession being loaded.
   * @param {Character} character - The character loading the skills.
   *
   * @return {array}
   */
  getTrained(dbRow, type, character) {
    return _.get(dbRow, 'trained', {});
  }

  /**
   * Get the support skills a character has access to, keyed by the profession that has the skill.
   *
   * @param {Character} character - The character to check.
   *
   * @return {array}
   */
  getSupportSkills(character) {
    let skills = {};

    const professions = Professions.all();

    for (const professionType in professions) {
      if (character.hasMasteredProfession(professionType)) {
        const profession = Professions.new(professionType);
        skills[professionType] = profession.getSkills(character)[profession.supportSkill];
      }
    }

    return skills;
  }

  /**
   * Get the support skill for this profession.
   *
   * @param {Character} character - The character to get the support skill for.
   *
   * @return {object}
   */
  getSupportSkill(character) {
    return this.getSkills(character, false)[this.supportSkill];
  }

  /**
   * Returns the details of this profession, so players can make informed choices.
   *
   * @param {Character} character - The character looking to change professions.
   *
   * @return {string}
   */
  getDetails(character) {
    let details = this.details + "\n*Stats:*";

    const stats = this.getStats(character);
    for (const type in stats) {
      const name = getLongAttributeName(type) + ` +${stats[type].increase}`;
      const level = _.get(this.trained, type, 0);
      const max = stats[type].costs.length;
      details += `\n>- *${name}:* ${level}/${max}`;
    }

    details += "\n*Skills:*";

    const skills = this.getSkills(character, false);
    for (const type in skills) {
      const skill = skills[type];
      const trainedText = (this.trained[type] || _.isUndefined(skill.spCost)) ? " (✓)" : "";
      details += `\n>- *${skill.name}${trainedText}:* ${skill.description}`;

      if (skill.properties.length) {
        let properties = skill.properties.map((property) => getPropertyName(property, character));
        details += ` _(${properties.join(", ")})_`;
      }
    }

    const masteryTrainedText = this.trained.mastery ? " (✓)" : "";
    return `${details}\n*Mastery${masteryTrainedText}:* ${this.masteryDescription}\n${this.adText}`;
  }

  /**
   * Get the crit bonus for this character.
   *
   * @param {Character} character - The attacking character.
   * @param {Enemy} enemy - The enemy being attacked.
   *
   * @return {float}
   */
  getCritBonus(character, enemy) {
    return 1.5;
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
   * Perform any post-fight actions that always happen.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(character, messages) {
    character.clearFlag(FLAGS.IS_DEFENDING);
    character.clearFlag(FLAGS.IS_FOCUSED);
    character.clearFlag(FLAGS.SOOTHED_TURNS);
    character.clearFlag(FLAGS.IS_EVADING);
    character.clearFlag(FLAGS.RAGE_BONUS);
    character.clearFlag(FLAGS.IS_RIPOSTING);

    return messages;
  }

  /**
   * Perform any post-fight success actions and return the messages arising from them.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    if (character.hasFlag(FLAGS.SOOTHED_TURNS)) {
      messages.push(this.beSoothed(character));
    }

    return messages;
  }

  /**
   * Perform any post-fight failure actions and return the messages arising from them.
   *
   * @param {Character} character - The character who lost the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightFailure(character, messages) {
    return messages;
  }

  /**
   * Do any extra actions required when running.
   *
   * @param {Character} character - The character who lost the fight.
   * @param {array} message - The previously-generated messages.
   *
   * @return {array}
   */
  doFightRun(character, messages) {
    return messages;
  }

  /**
   * Get the cost for switching to this profession.
   *
   * @param {Character} character - The character switching professions.
   *
   * @return {string}
   */
  getCostText(character) {
    const cost = this.getCost(character);
    return (cost > 0)
      ? `It will cost ${cost} gold to switch to this profession.`
      : "You can switch to this profession for free.";
  }

  /**
   * Get the short text for switching to this profession.
   *
   * @param {Character} character - The character switching professions.
   *
   * @return {string}
   */
  getCostTextShort(character) {
    const cost = this.getCost(character);
    return (cost > 0) ? `${cost}g` : "Free";
  }

  /**
   * Get the cost to switch to this profession.
   *
   * @param {Character} character - The character switching professions.
   *
   * @return {integer}
   */
  getCost(character) {
    return this._changeCost;
  }

  /**
   * Check and see if a spell is forbidden to this profession.
   *
   * @param {Spell} spell - The spell to check.
   *
   * @return {boolean}
   */
  isSpellForbidden(spell) {
    return false;
  }

  /**
   * Gets all the names this profession can go by, including aliases.
   *
   * @return {array} The list of names.
   */
  get allNames() {
    return this.aliases.concat(this._displayName);
  }

  /**
   * Perform any actions that need to be taken when mastering this profession.
   *
   * @param {Character} character - The character mastering this profession.
   */
  async performMasteryActions(character) {
    if (character.party) {
      return character.party.addMasteryBonus(character);
    }

    return '';
  }

  /**
   * Perform any actions that need to be taken when improving the mastery of this profession.
   *
   * @param {Character} character - The character improving their mastery.
   */
  async performImproveMasteryActions(character) {
    if (character.party) {
      return character.party.addImprovedMasteryBonus(character);
    }

    return '';
  }

  /**
   * Get the mastery level of this profession.
   *
   * @param {Character} character - The character to get the mastery level for.
   *
   * @return {integer}
   */
  getMasteryLevel(character) {
    return character.getStat(STATS.PROFESSION_MASTERY, this.type);
  }

  /**
   * Get the description for what happens when you improve your mastery.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getMasteryImprovementDescription(character) {
    const nextLevel = this.getMasteryLevel(character) + 1;
    return sprintf(
      this._masteryImprovementDescription,
      this.getNextMasteryIncrement(character),
      Math.round((this.getMasteryBonus(character, nextLevel) - 1) * 100)
    );
  }

  /**
   * Get the current mastery bonus for this character.
   *
   * @param {Character} character - The character to get the mastery bonus for.
   *
   * @return {mixed}
   */
  getMasteryBonus(character) { }

  /**
   * Get the next mastery bonus for this character.
   *
   * @param {Character} character - The character to get the next mastery bonus for.
   *
   * @return {mixed}
   */
  getNextMasteryIncrement(character) { }

  /**
   * Get the stats available for purchase for this character/profession.
   *
   * @param {Character} character - The character getting the stats of this profession.
   *
   * @return {array}
   */
  getStats() {
    return [];
  }

  /**
   * Get the skills the provided character has access to from this profession.
   *
   * @param {Character} character - The character getting the skills of this profession.
   * @param {boolean} addSupport - Add selected Support Skill.
   *
   * @return {object}
   */
  getSkills(character, addSupport = true) {
    return {};
  }

  /**
   * Change to the desired lyca form.
   *
   * @param {Character} character - The character changing form.
   * @param {string} form - The form to change to.
   */
  changeToForm(character, form) {
    character.setFlag(FLAG_OLD_PROFESSION, character.profession.type);

    character.profession = Professions.new(`${PROFESSIONS.LYCA}_${form}`);
    character.profession.trained = character.profession.getTrained();
    character.profession.loaded = true;

    character.setFlag(FLAGS.PROFESSION_SUBTYPE, form);
    character.stamina = character.getMaxStamina();
  }

  /**
   * Revert from shifted Lyca form.
   *
   * @param {Character} character - The character reverting from shifted form.
   */
  revertFromForm(character) {
    character.clearFlag(FLAGS.PROFESSION_SUBTYPE);
    character.profession = Professions.new(character.getFlag(FLAG_OLD_PROFESSION));
  }

  /**
   * Add this character's support skill to their list of skills.
   *
   * @param {Character} character - The character to add the support skill to.
   * @param {object} skills - The skills the character alraedy has.
   *
   * @return {object}
   */
  addSupportSkill(character, skills) {
    if (character.supportProfession) {
      const supportProfession = Professions.new(character.supportProfession);

      const supportSkill = supportProfession.getSupportSkill(character);

      if (supportSkill) {
        skills[supportProfession.supportSkill] = supportSkill;
        skills[supportProfession.supportSkill].is_support = true;
      }
    }

    return skills;
  }

  /**
   * Get the buttons for the skills this character can perform.
   *
   * @param {Character} character - The character looking to perform these skills.
   *
   * @return {Actions}
   */
  getSkillActions(character) {
    const trained = character.profession.trained;
    const skills  = this.getSkills(character);

    let actions = new Actions();

    for (let type in skills) {
      const skill = skills[type];

      if (_.isUndefined(skill.spCost) || _.isDefined(trained[type]) || _.get(skill, 'is_support', false)) {
        const style = this.canDoSkill(character, type) ? 'default' : 'danger';
        actions.addButton(`${skill.name} [-${skill.cost}]`, "fight_action", { params: { action: "skill", skill: type }, style });
      }
    }

    return actions;
  }

  /**
   * Gives professions a chance to modify a character's action buttons.
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
   * Gives professions a chance to modify a character's skill action buttons.
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
   * Determine if a character can train a new level in a stat.
   *
   * @param {string} statType - The type of the stat the player is trying to train.
   *
   * @return {boolean}
   */
  canTrainStat(statType) {
    const stat  = this.getStats()[statType];
    const level = _.get(this.trained, statType, 0);

    const hasSp  = this.sp >= stat.costs[level];
    const notMax = level < stat.costs.length;

    return (hasSp && notMax);
  }

  /**
   * Get the error message when attempting to train a stat causes an error.
   *
   * @param {Character} character - The character doing the training.
   * @param {string} statType - The type of the stat beign traiend.
   *
   * @return {string} The error message.
   */
  getTrainStatError(character, statType) {
    const stat  = this.getStats()[statType];
    const level = _.get(this.trained, statType, 0);

    if (this.sp < stat.costs[level]) {
      return ":warning: You do not have enough SP to train that stat.";
    }
    else if (level >= stat.costs.length) {
      return ":warning: You can't train that stat any higher.";
    }
    else {
      Log.error("Cannot train stat for unknown reason!");
      return ":warning: You cannot train that stat.";
    }
  }

  /**
   * Determine if a character can train a skill.
   *
   * @param {Character} character - The character attempting to train a skill.
   * @param {string} skillType - The type of the skill the player is trying to train.
   *
   * @return {boolean}
   */
  canTrainSkill(character, skillType) {
    const skill = this.getSkills(character)[skillType];

    const hasSp        = this.sp >= skill.spCost;
    const hasReqSp     = this.spSpent >= skill.reqSp;
    const hasntLearned = _.isUndefined(this.trained[skillType]);

    return (hasSp && hasReqSp && hasntLearned);
  }

  /**
   * Get the error that explains why a character can't train a skill.
   *
   * @param {Character} character - The character attempting to train a skill.
   * @param {string} skillType - The type of the skill the player is trying to train.
   *
   * @return {string}
   */
  getTrainSkillError(character, skillType) {
    const skill = this.getSkills(character)[skillType];
    if (this.sp < skill.spCost) {
      return ":warning: You do not have enough SP to train that skill.";
    }
    else if (this.spSpent < skill.reqSp) {
      return ":warning: You have not spent the required amount of SP to train that skill.";
    }
    else if (_.isDefined(this.trained[skillType])) {
      return ":warning: You have already trained that skill.";
    }
    else {
      Log.error("Cannot train skill for unknown reason!");
      return ":warning: You cannot train that skill.";
    }
  }

  /**
   * Determine if a character can train their mastery.
   *
   * @return {boolean}
   */
  canTrainMastery() {
    const hasSp        = this.sp >= this.spMastery;
    const hasReqSp     = this.spSpent >= this.reqSpMastery;
    const hasntLearned = _.isUndefined(this.trained.mastery);

    return (hasSp && hasReqSp && hasntLearned);
  }

  /**
   * Get the error that explains why a character can't train their mastery.
   *
   * @param {Character} character - The character attempting to train their mastery.
   *
   * @return {string}
   */
  getTrainMasteryError(character) {
    if (this.sp < this.spMastery) {
      return ":warning: You do not have enough SP to train your mastery.";
    }
    else if (this.spSpent < this.reqSpMastery) {
      return ":warning: You have not spent the required amount of SP to train your mastery.";
    }
    else if (_.isDefined(this.trained.mastery)) {
      return ":warning: You have already trained your mastery.";
    }
    else {
      Log.error("Cannot train mastery for unknown reason!");
      return ":warning: You cannot train your mastery.";
    }
  }

  /**
   * Check to see if a character can perform a specific combat skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} type - The type of the skill to perform.
   *
   * @return {boolean}
   */
  canDoSkill(character, type) {
    if (character.hasFlag(FLAGS.CONCUSSED_TURNS)) {
      return false;
    }

    const skill = this.getSkills(character)[type];

    if (this.isSkillSlotDisabled(character, type)) {
      return false;
    }
    if (SKILL_SOOTHE === type && character.hasFlag(FLAGS.FIGHT_COOLDOWN_SOOTHE)) {
      return false;
    }
    else if (SKILL_EVADE === type && character.hasFlag(FLAGS.IS_EVADING)) {
      return false;
    }
    else if (SKILL_FOCUS === type && character.hasFlag(FLAGS.IS_FOCUSED)) {
      return false;
    }
    else if (skill.properties.includes(PROPERTIES.IS_ATTACK) && ! character.canAttack(skill.properties)) {
      return false;
    }
    else if (SKILL_QUICK_RELOAD === type && ! (character.weapon instanceof Gun)) {
      return false;
    }
    else if (SKILL_RIPOSTE === type && character.hasFlag(FLAGS.RIPOSTE_COOLDOWN_TURNS)) {
      return false;
    }
    else if (SKILL_BEAR === type && character.hasFlag(FLAGS.BEAR_FORM_COOLDOWN)) {
      return false;
    }

    return character.stamina >= skill.cost;
  }

  /**
   * Identify if the specific, numbered skill slot for the requested skill is disabled.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} type - The type of the skill to perform.
   *
   * @return {boolean}
   */
  isSkillSlotDisabled(character, type) {
    const slot = Object.keys(this.getSkills(character)).indexOf(type);

    return character.hasFlag(`${FLAGS.SKILL_SLOT_DISABLED_TURNS}_${slot}`);
  }

  /**
   * Get the error message for why you can't use this skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} type - The type of the skill to perform.
   *
   * @return {string}
   */
  getSkillErrorMessage(character, type) {
    if (character.hasFlag(FLAGS.CONCUSSED_TURNS)) {
      return ":warning: You cannot use any skills while concussed.";
    }

    const skill = this.getSkills(character)[type];

    if (this.isSkillSlotDisabled(character, type)) {
      return ":warning: This skill has been temporarily disabled.";
    }
    else if (SKILL_SOOTHE === type && character.hasFlag(FLAGS.FIGHT_COOLDOWN_SOOTHE)) {
      return ":warning: You can only use Soothe once per fight.";
    }
    else if (SKILL_EVADE === type && character.hasFlag(FLAGS.IS_EVADING)) {
      return ":warning: You are already evading.";
    }
    else if (SKILL_FOCUS === type && character.hasFlag(FLAGS.IS_FOCUSED)) {
      return ":warning: You are already focused.";
    }
    else if (skill.properties.includes(PROPERTIES.IS_ATTACK) && character.hasFlag(FLAGS.IS_JAMMED)) {
      return ":warning: Your gun is jammed!";
    }
    else if (skill.properties.includes(PROPERTIES.IS_ATTACK) && character.weapon.needsReloading(character)) {
      return ":warning: You're out of ammo!";
    }
    else if (SKILL_QUICK_RELOAD === type && ! (character.weapon instanceof Gun)) {
      return ":warning: Only guns can be reloaded.";
    }
    else if (SKILL_RIPOSTE === type && character.hasFlag(FLAGS.RIPOSTE_COOLDOWN_TURNS)) {
      const turns = character.getFlag(FLAGS.RIPOSTE_COOLDOWN_TURNS);
      const turnsText = pluralize("turn", turns);
      return `:warning: You are recovering from your Riposte for ${turns} more ${turnsText}.`;
    }
    else if (SKILL_BEAR === type && character.hasFlag(FLAGS.BEAR_FORM_COOLDOWN)) {
      const fights = character.getFlag(FLAGS.BEAR_FORM_COOLDOWN);
      return `:warning: You must recover for ${fights} more ${pluralize('fight', fights)} before you can shift into bear form.`;
    }

    return ":warning: You don't have enough Stamina to do that!";
  }

  /**
   * Perform a specific combat skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} skill - The skill to perform.
   *
   * @return {array} Messages arising from the skill.
   */
  doSkill(character, skill) {
    if (SKILL_SOOTHE === skill) {
      return this.doSkillSoothe(character);
    }
    else if (SKILL_FOCUS === skill) {
      return this.doSkillFocus(character);
    }
    else if (SKILL_EVADE === skill) {
      return this.doSkillEvade(character);
    }
    else if (SKILL_GUARD === skill) {
      return this.doSkillGuard(character);
    }
    else if (SKILL_QUICK_RELOAD === skill) {
      return this.doSkillQuickReload(character);
    }
    else if (SKILL_RIPOSTE === skill) {
      return this.doSkillRiposte(character);
    }
    else if (SKILL_RAGE === skill) {
      return this.doSkillRage(character);
    }
    else if (SKILL_BEAR === skill) {
      return this.doSkillBear(character);
    }
    else {
      throw new Error(`Unknown skill: "${skill}".`);
    }
  }

  /**
   * Soothe your wounds, healing 10% max HP turn for 4 turns.
   *
   * @param {Character} character - The character soothing their wounds.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillSoothe(character) {
    character.setFlag(FLAGS.FIGHT_COOLDOWN_SOOTHE, COOLDOWN_FIGHTS_SOOTHE);
    character.setFlag(FLAGS.SOOTHED_TURNS, TURNS_SOOTHED);
    character.stamina -= STAMINA_SOOTHE;

    return ["You soothe your wounds."];
  }

  /**
   * If soothed, heal some HP!
   *
   * @param {Character} character - The character being soothed.
   *
   * @return {array} The messages generated by being soothed.
   */
  beSoothed(character) {
    // Have to manually manage turns so that fight success gets one more turn of healing
    character.decrementFlag(FLAGS.SOOTHED_TURNS);

    character.increaseHp(SOOTHE_HP_HEALED);
    const remainingTurns = character.getFlag(FLAGS.SOOTHED_TURNS);
    const remainingText = remainingTurns > 0 ? ` (${remainingTurns} turns remaining)` : "";

    return `:relieved: You are soothed and regain ${SOOTHE_HP_HEALED} HP${remainingText}.`;
  }

  /**
   * Do 3x damage on your next damaging spell for 2x cost.
   *
   * @param {Character} character - The character performing this skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillFocus(character) {
    character.stamina -= STAMINA_FOCUS;
    character.setFlag(FLAGS.IS_FOCUSED);
    return [":pray: You clear your mind and focus, ensuring your next damaging spell is twice as powerful at 150% the cost."];
  }

  /**
   * Evade, gaining 25% dodge until your next dodge.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillEvade(character) {
    character.stamina -= STAMINA_EVADE;
    character.setFlag(FLAGS.IS_EVADING);

    return [":sweat: You focus on evading, gaining 25% dodge."];
  }

  /**
   * Guard, blocking 90% of all damage for this turn.
   *
   * @param {Character} character - The character guarding.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillGuard(character) {
    character.setFlag(FLAGS.IS_GUARDING);
    character.stamina -= STAMINA_GUARD;

    return [":shield: You ready your defenses!"];
  }

  /**
   * Reload your weapon, then attack.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillQuickReload(character) {
    character.stamina -= STAMINA_QUICK_RELOAD;
    const reloadText = "With a flourish, you reload your %s and leap back into combat!";

    return character.weapon.doReload(character, reloadText).concat(Combat.doAttack(character));
  }

  /**
   * Reflect 50% of next attack back to opponent.  4 turn cooldown, places Defend on cooldown as
   * well.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillRiposte(character) {
    character.stamina -= STAMINA_RIPOSTE;

    let messages = [];

    character.setFlag(FLAGS.IS_RIPOSTING);
    character.setFlag(FLAGS.RIPOSTE_COOLDOWN_TURNS, 4);

    messages.push("You prepare to riposte your enemy's next standard or furious attack!");

    return messages;
  }


  /**
   * Attack and gain a 5% crit bonus for the fight.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillRage(character) {
    character.stamina -= STAMINA_RAGE;

    const rageBonus = character.getFlag(FLAGS.RAGE_BONUS, 0);
    character.setFlag(FLAGS.RAGE_BONUS, rageBonus + RAGE_BONUS_INCREMENT);

    let messages = [`You slap yourself and get mad, increasing your crit chance for this fight by ${RAGE_BONUS_INCREMENT}!`];

    return messages.concat(Combat.doAttack(character));
  }

  /**
   * Take the form of a bear.
   *
   * @param {Character} - The character perofrming this action.
   *
   * @return {array}
   */
  doSkillBear(character) {
    character.stamina -= STAMINA_BEAR;
    character.setFlag(FLAGS.BEAR_FORM_COOLDOWN, FIGHTS_COOLDOWN_BEAR);

    this.changeToForm(character, LYCA_FORMS.BEAR);
    return ["Heavy fur explodes from your skin, fangs erupt from your mouth, and claws slide out from your fingers as you shift into the form of a bear!"];
  }

  /**
   * Perform a standard attack action.
   *
   * @param {Character} character - The character performing the attack.
   *
   * @return {array} The messages generated.
   */
  doAttack(character) {
    character.stamina += STAMINA_INCREASE_FIGHT;
    return Combat.doAttack(character);
  }

  /**
   * Perform a defend action.
   *
   * @param {Character} character - The character defending.
   *
   * @return {array} The messages generated.
   */
  doDefend(character) {
    let messages = [];

    character.setFlag(FLAGS.IS_DEFENDING);
    character.stamina += STAMINA_INCREASE_DEFEND;

    messages.push(":neutral_face: You take a moment to defend yourself and catch your breath.");
    messages = messages.concat(character.weapon.doDefend(character));

    return messages;
  }

  /**
   * After an attack has been performed, allow the attacker to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Character} character - The character doing the attacking.
   * @param {Combatant} defender - The defending combatant.
   *
   * @return {object}
   */
  doAttackerPostAttackProcessing(attackInfo, character, defender) {
    return attackInfo;
  }

  /**
   * After an attack has been performed, allow the defender to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Character} character - The character doing the defending.
   * @param {Combatant} attacker - The attacking combatant.
   *
   * @return {object}
   */
  doDefenderPostAttackProcessing(attackInfo, character, attacker) {
    // If character is guarding, receive only 10% damage
    if (character.hasFlag(FLAGS.IS_GUARDING)) {
      attackInfo.damage = Math.ceil(attackInfo.damage / 10);
    }

    // If character dodged while evading, clear evade flag
    if (character.hasFlag(FLAGS.IS_EVADING) && attackInfo.didDodge) {
      character.clearFlag(FLAGS.IS_EVADING);
      character.setFlag(FLAGS.DID_EVADE);
    }

    return attackInfo;
  }

  /**
   * Allow attack parameters to be modified before being used in an attack.
   *
   * @param {object} params - The parameters to modify.
   * @param {Combatant} defender - The defender of the attack.
   * @param {Character} character - The attacking character.
   *
   * @return {object}
   */
  attackerModifyAttackParameters(params, defender, character) {
    params.crit += character.getFlag(FLAGS.RAGE_BONUS, 0);

    return params;
  }

  /**
   * Allow attack parameters to be modified before being used in an attack.
   *
   * @param {object} params - The parameters to modify.
   * @param {Combatant} attacker - The attacker.
   * @param {Character} character - The defending character.
   *
   * @return {object}
   */
  defenderModifyAttackParameters(params, attacker, character) {
    return params;
  }

  /**
   * Do any actions that might happen after each round of combat (regen, etc.)
   *
   * @param {Character} character - The character in combat.
   *
   * @return {array} The messages generated by these actions.
   */
  doPostRoundActions(character) {
    let messages = [];

    if (character.hasFlag(FLAGS.SOOTHED_TURNS)) {
      messages.push(this.beSoothed(character));
    }

    if (character.hasFlag(FLAGS.DID_EVADE)) {
      character.clearFlag(FLAGS.DID_EVADE);
      character.stamina = character.getMaxStamina();
      messages.push("Having evaded, you lose your 25% extra dodge chance but fill your Stamina!");
    }

    return messages;
  }
}

/**
 * Utility class for searching and creating new profession objects.
 */
class Professions extends Content {}

module.exports = {
  Profession,
  Professions
};

/**
 * @type array The collection of professions.
 */
Files.loadContent(`${CONTENT_FILES_PATH}/professions/`, `${CONTENT_FILES_PATH}/professions/`, collection);

/**
 * @type object The names of the professions, for quick reference.
 */
Files.getNames(collection, names);

/**
 * @type objec The types of the professions, keyed by name, for quick reference.
 */
Files.getTypes(collection, types);
