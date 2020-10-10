"use strict";

const crypto  = require('crypto');
const moment  = require('moment');
const Actions = require('slacksimple').Actions;

const Log           = require('@util/log');
const Text          = require('@util/text');
const Random        = require('@util/random');
const { isWeekend } = require('@util/time');

const Combatant = require('@app/combatant');
const Combat    = require('@app/combat');
const Inventory = require('@app/inventory');
const Equipment = require('@app/equipment');
const Party     = require('@app/party');

const { Items }      = require('@app/content/items');
const { Spells }     = require('@app/content/spells');
const { Locations }  = require('@app/content/locations');
const { Encounters } = require('@app/content/encounters');
const { Enemy }      = require('@app/content/enemies');
const { Boosts }     = require('@app/content/boosts');
const { Profession, Professions } = require('@app/content/professions');

const {
  AP_MINUTES,
  CHARACTER_STATE,
  FIGHT_ACTIONS,
  FLAGS,
  PROPERTIES,
  PROFESSIONS,
  STATS,
  TURNS_POISON_CLOUD,
  ENEMY_XP_PER_LEVEL,
  AOE_BONUS,
  WEAPON_DAMAGE_BONUS,
  CURSED_CHEST_FRAILTY_PENALTY,
  COLORS
} = require('@constants');

const DEFAULT_MAX_AP = 5;
const WEEKEND_MAX_AP = 10;
const DEFEND_REDUCTION = 0.5;
const MAX_MESSAGES = 25;

class Character extends Combatant {
  constructor() {
    super();
    this.loadParty = true;
    this.party = false;
  }

  /**
   * Set the values for this character from the database.
   *
   * @param {object} info - The row of character info from the database.
   *
   * @return {Character}
   */
  setValues(info) {
    this._isLoading = true;

    this.id           = _.get(info, 'id', '');
    this.uid          = _.get(info, 'uid', '');
    this.teamid       = _.get(info, 'teamid', '');
    this._displayName = _.get(info, 'display_name', '');
    this.email        = _.get(info, 'email', '');
    this.channel      = _.get(info, 'channel', '');
    this.locale       = _.get(info, 'locale', 'en');
    this.isAre       = "are";
    this.token        = _.get(info, 'token', this.generateNewToken());

    // World info
    this.location = Locations.new(_.get(info, 'location', 'tyrose'));
    this.state    = _.get(info, 'state', CHARACTER_STATE.IDLE);

    this.xp      = _.get(info, 'xp', 0);
    this.level   = _.get(info, 'level', 1);
    this._gold   = _.get(info, 'gold', 0);
    this._scales = _.get(info, 'scales', 0);

    this._force      = _.get(info, 'force', 1);
    this._technique  = _.get(info, 'technique', 1);
    this._defence    = _.get(info, 'defence', 1);
    this._crit       = _.get(info, 'crit', 5);
    this._dodge      = _.get(info, 'dodge', 5);
    this._spellPower = _.get(info, 'spell_power', 0);

    this.ap     = _.get(info, 'ap', DEFAULT_MAX_AP);
    this.lastAp = _.get(info, 'last_ap', moment().format('YYYY-MM-DD H:mm:ss'));

    this.updatedAt = _.get(info, 'updated_at', moment().format('YYYY-MM-DD H:mm:ss'));

    this._maxHp     = _.get(info, 'max_hp', 50);
    this._hp        = _.get(info, 'hp', this.maxHp);
    this.maxMp      = _.get(info, 'max_mp', 30);
    this._mp        = _.get(info, 'mp', this.maxMp);
    this._stamina   = _.get(info, 'stamina', 0);

    this.weapon    = Items.new(_.get(info, 'weapon', 'equipment-weapons-001_pine_club'));
    this.relic     = Items.new(_.get(info, 'relic', 'equipment-relics-000_no_relic'));
    this.armour    = Items.new(_.get(info, 'armour', 'equipment-armour-001_clothes'));
    this.accessory = Items.new(_.get(info, 'accessory', 'equipment-accessories-000_no_accessory'));
    this.pet       = Items.new(_.get(info, 'pet', 'equipment-pets-000_no_pet'));

    this.supportProfession = _.get(info, 'support_profession', '');

    this.petsOwned = [];

    this._flags = _.get(_.omitBy(info, _.isEmpty), 'flags', {});
    this._stats = _.get(_.omitBy(info, _.isEmpty), 'stats', {});
    this.boosts = this.deserializeBoosts(_.get(_.omitBy(info, _.isEmpty), 'boosts', []));
    this.knownSpells = _.get(_.omitBy(info, _.isEmpty), 'known_spells', []);
    this.messageTimestamps = _.get(_.omitBy(info, _.isEmpty), 'message_timestamps', []);

    let encounterType = _.get(info, 'encounter', false);
    if (encounterType) {
      this.encounter = Encounters.new(encounterType);
    }

    this.inventory = new Inventory();
    this.equipment = new Equipment();

    this._isLoading = false;

    return this;
  }

  /**
   * If in development or public test.
   *
   * @return {boolean}
   */
  isInTestMode() {
    const testEnvironments = [
      'public-test',
      'dev'
    ];

    return testEnvironments.includes(process.env.MODE);
  }

  /**
   * Get the Max HP this combatant has.
   *
   * @return {integer}
   */
  get maxHp() {
    return this.hasFlag(FLAGS.CHEST_CURSE_FRAILTY) ? (Math.ceil(this._maxHp * (1 - CURSED_CHEST_FRAILTY_PENALTY))) : this._maxHp;
  }

  /**
   * Get tha maximum AP this character can have.
   *
   * return {integer}
   */
  get maxAp() {
    return (isWeekend() ? WEEKEND_MAX_AP : DEFAULT_MAX_AP) + this.getBoostValue('MaxAp');
  }

  /**
   * Get the force this character has.
   *
   * @return {integer}
   */
  get force() {
    return this._force + this.getBoostValue('Force');
  }

  /**
   * Get the technique this character has.
   *
   * @return {integer}
   */
  get technique() {
    return this._technique + this.getBoostValue('Technique');
  }

  /**
   * Get the defence this character has.
   *
   * @return {integer}
   */
  get defence() {
    return this._defence + this.getBoostValue('Defence');
  }

  /**
   * Get the Spell Power this character has.
   *
   * @return {integer}
   */
  get spellPower() {
    return this._spellPower + this.getBoostValue('SpellPower');
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
   * Get the dodge chance this character has.
   *
   * @return {integer}
   */
  get dodge() {
    return this._dodge;
  }

  /**
   * Default max stamina is 6.
   *
   * @return {integer}
   */
  getMaxStamina() {
    return 6;
  }

  /**
   * Track a lifecycle event for this character.
   *
   * @param {string} event - The event being tracked.
   * @param {object} extraFields - Extra fields and values to track in addition to character values.
   */
  async track(event, extraFields = {}) {
    // Never track events when running tests, that's silly
    if ('test' === process.env.NODE_ENV) {
      return;
    }

    let fields = _.clone(extraFields);

    fields.character_level = this.level;
    fields.profession = this.profession.type;
    fields.ap_spent = this.getStat('ap_spent');
    fields.xp = this.xp;
    fields.gold = this.gold;

    this.slashbot.enqueueEvent(event, this.id, fields);
  }

  /**
   * Get the select query & params to use to load the character.
   *
   * @param {object} where - Parameters to use to narrow down the character to load.
   *
   * @return [query, params]
   */
  getLoadQuery(where) {
    let conditions = [];
    let params = [];

    for (let condition in where) {
      conditions.push(`${condition} = ?`);
      params.push(where[condition]);
    }

    return [
      'SELECT * FROM characters WHERE ' + conditions.join(' AND '),
      params
    ];
  }

  /**
   * Load a character from DB.
   *
   * @param {object} where - Parameters to use to narrow down the character to load.
   * @param {Slashbot} slashbot - The Slashbot instance that loaded this character.
   * @param {string} queueSuffix - The suffix for the queue this character was loaded from.
   * @param {Connection} connection - An optional DB connection to use.
   *
   * @return {Character}
   */
  async load(where, slashbot, queueSuffix, { connection = false } = {}) {
    this.slashbot = slashbot;
    this.queueSuffix = queueSuffix;

    const [query, params] = this.getLoadQuery(where);

    this.connection = connection ? connection : await DB_POOL.getConnection();
    const [rows, ] = await this.connection.query(query, params);

    if (rows.length === 0) {
      throw new Error(`No character loaded for '${query}': [${params.join(', ')}]`);
    }

    this.setValues(rows[0]);

    let remainder; // eslint-disable-line no-unused-vars

    // Load everything at the same time
    [this.inventory, this.equipment, this.profession, ...remainder] =
      await Promise.all([
        Inventory.load(this, this.connection), // eslint-disable-line indent
        Equipment.load(this, this.connection), // eslint-disable-line indent
        Profession.load(this, rows[0].profession, this.connection), // eslint-disable-line indent
      ]);

    if (CHARACTER_STATE.FIGHTING === this.state) {
      this.enemy = await Enemy.load(this, this.connection);
    }

    if (this.encounter) {
      await this.encounter.loadExtra(this);
    }

    if (this.location) {
      await this.location.loadExtra(this);
    }

    if (this.loadParty) {
      this.party = await Party.load(this, this.connection);
    }

    // Remove any boosts that have expired, allowing them to send messages if current character in party
    this.boosts = this.boosts.filter(boost => ! boost.hasExpired(this, this.loadParty));

    // Gotta update AP after loading inventory & checking boosts, so we know true Max AP
    this.updateAp();

    return this;
  }

  /**
   * Save this character to the DB.
   *
   * @param {boolean} saveEnemy - If we should save the enemy.
   * @param {boolean} saveParty - If we should save the party.
   */
  async save({ saveEnemy = true, saveParty = true } = {}) {
    try {
      await this.connection.beginTransaction();
      let savingPromises = [
        this.connection.query('UPDATE characters SET ? WHERE id = ?', [this.getDbFields(), this.id]),
        this.inventory.save(this.id, this.connection),
        this.equipment.save(this.id, this.connection),
        this.profession.save(this.id, this.connection),
      ];

      if (saveEnemy && CHARACTER_STATE.FIGHTING === this.state) {
        savingPromises.push(this.enemy.save(this.id, this.connection));
      }

      // Only leaders can modify the party, so only they need to save it
      if (saveParty && this.party && this.party.isLeader(this)) {
        savingPromises.push(this.party.save(this.connection));
      }

      await Promise.all(savingPromises);

      await this.connection.commit();
    }
    // Make sure to roll back on any errors - node doesn't automatically discard failed transactions
    catch (err) {
      await this.connection.rollback();
      throw err;
    }
    finally {
      this.connection.release();
    }
  }

  /**
   * Create a new character for a user and give them the intro
   *
   * @param {string} uid - The user's ID.
   * @param {string} teamid - The ID of the team the user is on.
   * @param {string} name - The user's name.
   * @param {string} email - The user's email.
   * @param {string} channel - The channel the user is in.
   */
  static async create(uid, teamid, name, email, channel) {
    const connection = await DB_POOL.getConnection();
    const now = moment().format('YYYY-MM-DD H:mm:ss');

    try {
      await connection.beginTransaction();
      const token = crypto.randomBytes(12).toString('hex');
      const charFields = {
        display_name: name,
        email,
        uid,
        teamid,
        channel,
        token,
        created_at: now,
        updated_at: now,
        last_ap: now,
        flags: '{}',
        stats: '{}',
        boosts: '{}',
        known_spells: '[]'
      };

      const [result, ] = await connection.query('INSERT INTO characters SET ?', charFields);
      const character_id = result.insertId;

      const enemyFields = {
        character_id,
        type: 'none',
        level: '0',
        hp: '0',
        flags: '{}',
      };
      await connection.query('INSERT INTO enemies SET ?', enemyFields);
      await connection.query('INSERT INTO professions SET ?', { character_id, trained: "{}" });

      await connection.commit();
      connection.release();

      Log.info({ displayName: name, uid }, 'New character created:');

      return token;
    }
    catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  }

  /**
   * Get the database fields for this character.
   *
   * @return {object}
   */
  getDbFields() {
    return {
      display_name: this._displayName,
      email: this.email,
      channel: this.channel,
      locale: this.locale,
      token: this.token,
      location: this.location.type,
      weapon: this.weapon.type,
      relic: this.relic.type,
      armour: this.armour.type,
      accessory: this.accessory.type,
      pet: this.pet.type,
      support_profession: this.supportProfession,
      state: this.state,
      profession: this.profession.type,
      xp: this.xp,
      level: this.level,
      gold: this.gold,
      scales: this._scales,
      force: this._force,
      technique: this._technique,
      crit: this._crit,
      defence: this._defence,
      dodge: this._dodge,
      spell_power: this._spellPower,
      ap: this.ap,
      last_ap: this.lastAp,
      updated_at: moment().format('YYYY-MM-DD H:mm:ss'),
      max_hp: this._maxHp,
      hp: this._hp,
      max_mp: this.maxMp,
      mp: this._mp,
      stamina: this.stamina,
      encounter: _.isDefined(this.encounter) ? this.encounter.type : null,
      flags: JSON.stringify(this.getFlags()),
      stats: JSON.stringify(this.getStats()),
      boosts: this.serializeBoosts(),
      known_spells: JSON.stringify(this.knownSpells),
      message_timestamps: JSON.stringify(this.messageTimestamps),
    };
  }

  /**
   * Return useful information for logging.
   *
   * @return {object} The log information.
   */
  logInfo() {
    let logInfo = {
      id: this.id,
      location: this.location.type,
      state: this.state,
      profession: this.profession.type,
      flags: this._flags
    };

    if (this.state === CHARACTER_STATE.FIGHTING) {
      logInfo.enemy = this.enemy.type;
    }

    if (this.state == CHARACTER_STATE.ENCOUNTER) {
      logInfo.enemy = this.encounter.type;
    }

    return logInfo;
  }

  /**
   * Generate a new token for this character.
   *
   * @return {string}
   */
  generateNewToken() {
    this.token = crypto.randomBytes(12).toString('hex');
    return this.token;
  }

  // -- Stats -----------------------------------------------------------------------------------

  /**
   * Set a stat to a value.
   *
   * @param {string} stat - The stat to set.
   * @param {integer} value - The value of the stat to set.
   * @param {string} subType - The subtype of the current stat.
   */
  setStat(stat, value = 1, subType = null) {
    if (subType) {
      _.set(this._stats, `${stat}.${subType}`, value);
    }
    else {
      this._stats[stat] = value;
    }
  }

  /**
   * Return the value of a specific stat.
   *
   * @param {string} stat - The stat to get.
   * @param {string} subType - The subtype of the current stat.
   *
   * @return {integer}
   */
  getStat(stat, subType = null) {
    if (subType) {
      return _.get(this._stats, `${stat}.${subType}`, 0);
    }

    const value = _.get(this._stats, stat, 0);

    // If it's an object, grab the value of the first one set
    if (_.isObject(value)) {
      return _.values(value)[0];
    }

    return value;
  }

  /**
   * Increase a stat by a value.
   *
   * @param {string} stat - The stat to increase.
   * @param {integer} value - The value to increase by.
   * @param {string} subType - The subtype of the current stat.
   */
  increaseStat(stat, value = 1, subType = null) {
    this.setStat(stat, this.getStat(stat, subType) + value, subType);
  }

  /**
   * Check to see if a character has a stat with sufficient value.
   *
   * @param {string} stat - The stat to check.
   * @param {string} subType - The subtype of the stat to check.
   * @param {integer} value - The value to check.
   */
  hasStat(stat, { subType,  value = 1 } = {}) {
    return this.getStat(stat, subType) >= value;
  }

  /**
   * List all the stats you have.
   *
   * @return {array}
   */
  getStats() {
    return this._stats;
  }

  // -- /Stats ----------------------------------------------------------------------------------

  // -- Boosts ----------------------------------------------------------------------------------

  /**
   * Serialize the boosts from this character to JSON.
   *
   * @return {string}
   */
  serializeBoosts() {
    let boostData = [];

    for (let boost of this.boosts) {
      boostData.push({
        type: boost.type,
        data: boost.getData(),
      });
    }

    return JSON.stringify(boostData);
  }

  /**
   * Deserialize the boosts from JSON.
   *
   * @param {object} json - The JSON data to deserialize from.
   *
   * @return {[Boost]}
   */
  deserializeBoosts(json) {
    let boosts = [];

    for (let info of json) {
      boosts.push(Boosts.new(info.type, info));
    }

    return boosts;
  }

  /**
   * Check to see if this character has a boost.
   *
   * @param {string} type - The type of boost to check for.
   *
   * @return {boolean}
   */
  hasBoost(type) {
    return this.boosts.filter(boost => boost.type === type).length > 0;
  }

  /**
   * Add a boost to this character.
   *
   * @param {string} type - The type of boost to add.
   */
  addBoost(type) {
    this.boosts.push(Boosts.new(type).setInitialValues(this));
  }

  /**
   * Check all boosts for the provided value and return the combined value.
   *
   * @param {string} name - The name of the value to check for.
   *
   * @return {number}
   */
  getBoostValue(name) {
    return this.boosts.map(boost => boost[_.camelCase(`get_${name}_value`)](this)).reduce((acc, cur) => acc + cur, 0);
  }

  // -- /Boosts ---------------------------------------------------------------------------------

  // -- Timestamps ------------------------------------------------------------------------------

  /**
   * Add a timestamp to the character's list of recent message timestamps.
   *
   * @param {string} ts - The timestamp to add.
   */
  addTimestamp(ts) {
    this.messageTimestamps.push(ts);

    let toDelete = [];
    while (this.messageTimestamps.length > MAX_MESSAGES) {
      toDelete.push(this.messageTimestamps.shift());
    }

    if (toDelete.length) {
      for (let ts of toDelete) {
        this.slashbot.delete(ts, this);
      }
    }
  }

  // -- /Timestamps -----------------------------------------------------------------------------

  /**
   * Increase this combatant's MP by a certain amount.
   *
   * @param {integer} increaseBy - The amount of MP to increase by.
   *
   * @return {integer} The difference in MP.
   */
  increaseMp(increaseBy) {
    // Don't increase MP if your MP is already higher than your max (for temp MP)
    if (this._mp > this.maxMp) {
      return 0;
    }

    let originalMp = this._mp;
    this._mp = Math.min(this.maxMp, this._mp + increaseBy);

    return this._mp - originalMp;
  }

  /**
   * Get the display name of this character
   *
   * @return {string}
   */
  getDisplayName() {
    return "You";
  }

  /**
   * Returns the character's actual name.
   *
   * @return {string}
   */
  getTrueName() {
    return this._displayName;
  }

  /**
   * Get the locations connected to the character's location.
   *
   * @return {array}
   */
  getConnectedLocations() {
    return this.location.getConnectedLocations(this);
  }

  /**
   * Check if character has defeated a certain type of enemy at least a certain count of times.
   *
   * @param {string} type - The type of enemy to check.
   * @param {integer} count - The count of times to have defeated the enemy.
   *
   * @return {boolean}
   */
  hasKilledEnemy(type, count = 1) {
    return this.hasStat(STATS.ENEMIES_KILLED, { subType: type, value: count });
  }

  /**
   * Get the reason this character isn't earning SP.
   *
   * @return {string}
   */
  getZeroSpReason() {
    return this.profession.sp + this.profession.spSpent === this.profession.maxSp
      ? "no SP (profession max)"
      : "no SP (enemy is too low level)";
  }

  /**
   * Get the offence stat for this combatant.
   *
   * @return {integer}
   */
  getOffence() {
    return this.profession.getOffence(this);
  }

  /**
   * Check to see if you can travel to the specified location from here.
   *
   * @param {string} location - The type of the location to attempt to travel to.
   *
   * @return {boolean}
   */
  canTravelTo(location) {
    return this.location.canTravelTo(location, this);
  }
  /**
   * Get the message that explains why a character would not be able to travel to a location.
   *
   * @param {string} location - The location being travelled to.
   *
   * @return {string}
   */
  getTravelErrorMessage(location) {
    return this.location.getTravelErrorMessage(location, this);
  }

  /**
   * Get the title to display for the character's current state.
   *
   * @return {string}
   */
  getLookTitle() {
    if (this.state === CHARACTER_STATE.ENCOUNTER) {
      return this.encounter.getTitle(this);
    }
    else if (this.state === CHARACTER_STATE.FIGHTING) {
      return "Actions:";
    }
    else {
      return this.location.getLookTitle(this);
    }
  }

  /**
   * Get the description to display for the character's current state.
   *
   * @return {string}
   */
  getLookDescription() {
    if (this.state === CHARACTER_STATE.IDLE || this.state === CHARACTER_STATE.WOUNDED) {
      return this.location.getDescription(this);
    }
    else if (this.state === CHARACTER_STATE.FIGHTING) {
      return this.enemy.getDescription(this);
    }
    else if (this.state === CHARACTER_STATE.ENCOUNTER) {
      return this.encounter.getDescription(this);
    }
    else {
      throw new Error(`Invalid character state: ${this.state}`);
    }
  }

  /**
   * Get the actions for character.
   *
   * @return {array}
   */
  getActions() {
    if (this.state === CHARACTER_STATE.IDLE || this.state === CHARACTER_STATE.WOUNDED) {
      return this.location.getActions(this);
    }
    else if (this.state === CHARACTER_STATE.FIGHTING) {
      return Combat.getActions(this);
    }
    else if (this.state === CHARACTER_STATE.ENCOUNTER) {
      return this.encounter.getActions(this);
    }
    else {
      throw new Error(`Invalid character state: ${this.state}`);
    }
  }

  /**
   * Get any fields to display with the message.
   *
   * @return {array}
   */
  getFields() {
    if ([CHARACTER_STATE.IDLE, CHARACTER_STATE.WOUNDED, CHARACTER_STATE.ENCOUNTER].includes(this.state)) {
      const nextApAt = moment(this.lastAp).add(15, 'minutes');
      const hpText = `HP: ${this.hp}/${this.maxHp}`;
      const mpText = `MP: ${this._mp}/${this.maxMp}`;
      const apText = `AP: ${this.ap}/${this.maxAp}`;
      const apNextText = `Next AP ${moment().to(nextApAt)}`;
      const goldText = `Gold: ${this.gold.toLocaleString(this.locale)}`;
      const scalesText = `Scales: ${this.scales}`;
      const xp = this.xp.toLocaleString(this.locale);
      const xpToLevel = this.getXpToLevel(this.level).toLocaleString(this.locale);
      const xpText = `XP: ${xp}/${xpToLevel}`;
      const spText = `${this.profession.sp.toLocaleString(this.locale)} SP`;
      const charText =`${this.profession.getDisplayName(this)}, Level: ${this.level}`;

      return [{
        value: `${hpText}┃${mpText}┃${apText}┃${apNextText}\n${goldText}┃${scalesText}┃${xpText}┃${spText}\n${charText}`,
      }];
    }
    else if (this.state === CHARACTER_STATE.FIGHTING) {
      return Combat.getFields(this);
    }
    else {
      throw new Error(`Invalid character state: ${this.state}`);
    }
  }

  /**
   * Get the minimum damage of the weapon currently equipped.
   *
   * @return {integer}
   */
  get minDamage() {
    const increases = this.getStat(STATS.FLASK_PURCHASED, 'minDamage');
    const bonus = Math.ceil(this.weapon.minDamage * increases * WEAPON_DAMAGE_BONUS);

    return this.weapon.minDamage + bonus;
  }

  /**
   * Get the maximum damage of the weapon currently equipped.
   *
   * @return {integer}
   */
  get maxDamage() {
    const increases = this.getStat(STATS.FLASK_PURCHASED, 'maxDamage');
    const bonus = Math.ceil(this.weapon.maxDamage * increases * WEAPON_DAMAGE_BONUS);

    return this.weapon.maxDamage + bonus;
  }

  /**
   * Get the gold owned by this character.
   *
   * @return {integer}
   */
  get gold() {
    return this._gold;
  }

  /**
   * Set the gold owned by this character.
   *
   * @param {integer} gold - The gold to set.
   */
  set gold(gold) {
    this._gold = Math.min(parseInt(gold), this.getMaxGold());

    if (this._gold < 0) {
      throw new Error("Cannot have negative gold!");
    }
  }

  /**
   * Get the maximum amount of gold a character can carry.
   *
   * @return integer
   */
  getMaxGold() {
    return 10000;
  }

  /**
   * Get the scales owned by this character.
   *
   * @return {integer}
   */
  get scales() {
    return this._scales;
  }

  /**
   * Set the scales owned by this character.
   *
   * @param {integer} scales - The scales to set.
   */
  set scales(scales) {
    this._scales = parseInt(scales);

    if (this._scales < 0) {
      throw new Error("Cannot have negative scales!");
    }
  }

  /**
   * Get the MP this character has.
   *
   * @return {integer}
   */
  get mp() {
    return this._mp;
  }

  /**
   * Set the MP this character has.
   *
   * @param {integer} mp - The MP they have.
   */
  set mp(mp) {
    // Can't go below 0 or above maxMp
    this._mp = Math.max(0, Math.min(this.maxMp, mp));
  }

  /**
   * Get the stamina this character has.
   *
   * @return {integer}
   */
  get stamina() {
    return this._stamina;
  }

  /**
   * Set the stamina this character has.
   *
   * @param {integer} stamina - The stamina they have.
   */
  set stamina(stamina) {
    // Can't go below 0 or above maxStamina
    this._stamina = Math.max(0, Math.min(this.getMaxStamina(), stamina));
  }

  /**
   * Get the crit bonus for this character.
   *
   * @param {Enemy} enemy - The enemy being attacked.
   *
   * @return {float}
   */
  getCritBonus(enemy) {
    return this.profession.getCritBonus(this, enemy);
  }

  /**
   * Get the cost in gold to recover from a wound.
   * .3 gold per HP/MP.
   *
   * @return {integer}
   */
  getRecoveryCost() {
    return Math.ceil((this.maxHp + this.maxMp - this.mp) / 3);
  }

  /**
   * Get the cost in gold to heal remaining HP & MP.
   * .1 gold per HP/MP, same as in town (as potions).
   *
   * @return {integer}
   */
  getHealingCost() {
    const hpCost = this.maxHp - this.hp;
    const mpCost = (this.maxMp - this.mp) * 2;

    return Math.ceil((hpCost + mpCost) / 10);
  }

  /**
   * List the professions this character has trained in.
   */
  async listProfessions() {
    return await Profession.list(this);
  }

  /**
   * Identify if this character has been active in the last 24 hours.
   *
   * @return {Boolean}
   */
  isActive() {
    const yesterday = moment().subtract(1, 'day');
    return moment(this.updatedAt).isAfter(yesterday);
  }

  /**
   * Add the provided XP to the character's current profession.
   *
   * @param {integer} xp - The XP to award to the character's current profession.
   *
   * @return {array}
   */
  addXp(xp) {
    let response = [];

    this.xp += parseInt(xp);

    while (this.getRequiredToNextLevel() <= 0) {
      this.xp = (this.getRequiredToNextLevel() < 0) ? -this.getRequiredToNextLevel() : 0;
      response.push(this.levelUp());
    }

    return response;
  }

  /**
   * Get the amount of XP left to earn in order to reach the next level in this profession.
   *
   * @return {integer}
   */
  getRequiredToNextLevel() {
    return this.getXpToLevel(this.level) - this.xp;
  }

  /**
   * Get the XP required to hit a specific level.
   *
   * Assumes you fight your-level enemies.
   * Enemies give 50xp * their level.
   * Levelling requires (level + 2) wins worth of XP.
   *
   * @param {integer} level - The level to get the XP to reach.
   *
   * @return {integer}
   */
  getXpToLevel(level) {
    const enemyXp = ENEMY_XP_PER_LEVEL * level;
    const fightsPerLevel = level + 3;

    return enemyXp * fightsPerLevel;
  }

  /**
   * Ding!
   *
   * @return {string} The message generated by levelling up.
   */
  levelUp() {
    let statsText = [];

    this.level++;
    this.ap = Math.max(this.ap, this.maxAp);

    this._maxHp += 5;
    statsText.push(Text.getLongAttributeName('maxHp', 5));

    for (const stat of ['_force', '_technique', '_defence']) {
      this[stat]++;
      statsText.push(Text.getLongAttributeName(stat.substring(1), 1));
    }

    this.hp = this.maxHp;
    this.mp = this.maxMp;

    this.track('Level up');

    return `\`\`\`You have reached level ${this.level}!\n\nYour AP refills and you gain: ${statsText.join(', ')}.\`\`\``;
  }

  /**
   * Add any AP that may have accumulated since the last time this character was loaded.
   */
  updateAp() {
    const nextApAt = moment(this.lastAp).add(15, 'minutes');
    if (moment().isAfter(nextApAt)) {
      const gainedAp = Math.floor(moment().diff(moment(this.lastAp), 'minutes') / AP_MINUTES);
      this.ap = Math.min(this.ap + gainedAp, this.maxAp);
      const newApDate = moment(this.lastAp).add(gainedAp * AP_MINUTES, 'minutes');
      this.lastAp = newApDate.format('YYYY-MM-DD H:mm:ss');

      // Update profile so we get accurate data even if name/email are changed
      this.track('Profile', {
        email: this.email,
        name: this.getDisplayName(),
      });
    }
  }

  /**
   * If this character has mastered the specified profession.
   *
   * @param {string} profession - The profession to check.
   *
   * @return {boolean}
   */
  hasMasteredProfession(profession) {
    return this.hasStat(STATS.PROFESSION_MASTERY, { subType: profession });
  }

  /**
   * If this character has killed the green dragon.
   *
   * @return {boolean}
   */
  hasKilledGreenDragon() {
    return this.hasKilledEnemy('tyrose-lair-green_dragon');
  }

  /**
   * If this character has killed the brown dragon.
   *
   * @return {boolean}
   */
  hasKilledBrownDragon() {
    return this.hasKilledEnemy('scatterslide-brown_dragon');
  }

  /**
   * If this character has killed the Necrodragon.
   *
   * @return {boolean}
   */
  hasKilledNecrodragon() {
    return this.hasKilledEnemy('watermoon-mystic-necrodragon');
  }

  /**
   * If this character has killed the black dragon.
   *
   * @return {boolean}
   */
  hasKilledBlackDragon() {
    return this.hasKilledEnemy('watermoon-scholar-black_dragon');
  }

  /**
   * If this character has killed the red dragon.
   *
   * @return {boolean}
   */
  hasKilledRedDragon() {
    return this.hasKilledEnemy('watermoon-rumble-red_dragon');
  }

  /**
   * Determine if this character has a light source.
   *
   * @return {boolean}
   */
  hasLightSource() {
    // Cinders spell
    if (this.hasFlag(FLAGS.CINDERS_LIGHT_DURATION)) {
      return true;
    }

    // Accessories?
    if (this.accessory.providesLight) {
      return true;
    }

    // Pets?
    if (this.pet.providesLight) {
      return true;
    }

    // Torches
    if (this.inventory.has('torch')) {
      return true;
    }

    return false;
  }

  /**
   * Get the description of this light source.
   *
   * @return {string}
   */
  getLightSourceDescription() {
    // Cinders spell
    if (this.hasFlag(FLAGS.CINDERS_LIGHT_DURATION)) {
      const duration = this.getFlag(FLAGS.CINDERS_LIGHT_DURATION);
      return `Your Cinders spell clearly illuminates your surroundings.  It will only work for the next ${duration} ${Text.pluralize('encounter', duration)}.`;
    }

    // Accessories?
    if (this.accessory.providesLight) {
      return `Your ${this.accessory.getDisplayName(this)} gently illuminates your surroundings.`;
    }

    // Pet?
    if (this.pet.providesLight) {
      return `${this.pet.getDisplayName(this)} gently illuminates your surroundings.`;
    }

    // Torches
    if (this.inventory.has('torch')) {
      return `Your torch clearly illuminates your surroundings.  You have ${this.inventory.quantity('torch')} torches remaining.`;
    }
  }

  /**
   * You've encountered an enemy!  Consume 1 use of your light source.
   *
   * @return {string}
   */
  consumeLightSource() {
    // Cinders spell
    if (this.hasFlag(FLAGS.CINDERS_LIGHT_DURATION)) {
      const duration = this.getFlag(FLAGS.CINDERS_LIGHT_DURATION);
      if (duration > 1) {
        this.setFlag(FLAGS.CINDERS_LIGHT_DURATION, duration - 1);
        return `\n\nThe cinders sparking from your hands allow you to easily see ${this.enemy.getDisplayName(this)} trying to sneak up on you. As you begin combat, you can feel their glow fading.`;

      }
      else {
        this.clearFlag(FLAGS.CINDERS_LIGHT_DURATION);
        return `\n\nThe cinders sparking from your hands allow you to easily see ${this.enemy.getDisplayName(this)} trying to sneak up on you. As you begin combat, you can feel their glow disappear.  They *won't be around* to help you after this fight.`;
      }
    }

    // Accessories aren't consumed
    if (this.accessory.providesLight) {
      return '';
    }

    // Pets aren't consumed either
    if (this.pet.providesLight) {
      return '';
    }

    // Torches
    if (this.inventory.has('torch')) {
      this.inventory.remove('torch');
      this.increaseStat(STATS.ITEMS_CONSUMED, 1, 'torch');
      return `\n\nYour torch allows you to easily see ${this.enemy.getDisplayName(this)} trying to sneak up on you. You have ${this.inventory.quantity('torch')} torches remaining.`;
    }
  }

  /**
   * Return the skills the character can perform.
   *
   * @return {array}
   */
  getSkills() {
    return this.profession.getSkills(this);
  }

  /**
   * Get the actions for the skills this character can perform.
   *
   * @return {Actions}
   */
  getSkillActions() {
    if (this.hasFlag(FLAGS.STUNNED_TURNS) || this.hasFlag(FLAGS.FRENZY_TURNS)) {
      return new Actions();
    }

    return this.enemy.modifySkillActions(this, this.profession.getSkillActions(this));
  }

  /**
   * Check to see if the character has enough stamina to perform the indicated action.
   *
   * @param {object} info - Information about the action taken by the character.
   *
   * @return {boolean}
   */
  canDoAction(info) {
    // Do nothing: Can always do this
    if (info.action === FIGHT_ACTIONS.DO_NOTHING) {
      return true;
    }

    // Clear jam: Only if your weapon is jammed
    else if (info.action === FIGHT_ACTIONS.CLEAR_JAM) {
      return this.hasFlag(FLAGS.IS_JAMMED);
    }

    // Reload: Only if your weapon is out of ammo
    else if (info.action === FIGHT_ACTIONS.RELOAD) {
      return this.weapon.needsReloading(this);
    }

    // Can't do anything else if stunned
    else if (this.hasFlag(FLAGS.STUNNED_TURNS)) {
      return false;
    }

    // Defend: Can't defend if dazed
    else if (info.action === FIGHT_ACTIONS.DEFEND) {
      return ! this.hasFlag(FLAGS.DAZED_TURNS);
    }

    // Item: 1 stamina always
    else if (info.action === FIGHT_ACTIONS.ITEM) {
      return this.stamina >= 1;
    }

    // Skill: Stamina determined by skill
    else if (info.action === FIGHT_ACTIONS.SKILL) {
      return this.profession.canDoSkill(this, info.skill);
    }

    // Spell: Only if you have enough MP
    else if (info.action === FIGHT_ACTIONS.CAST) {
      return this.canCastSpell(info.spell);
    }

    // An action specific to an enemy
    else if (info.action === FIGHT_ACTIONS.ENEMY_ACTION) {
      return this.enemy.canDoCharacterFightAction(this, info.type);
    }

    return true;
  }

  /**
   * Learn a new spell!
   *
   * @param {string} type - The type of spell to learn.
   */
  learnSpell(type) {
    this.knownSpells.unshift(type);
  }

  /**
   * Confirm if this character knows this spell.
   *
   * @param {string} type - The type of the spell to check if the player knows.
   *
   * @return {boolean}
   */
  knowsSpell(type) {
    return this.knownSpells.includes(type);
  }

  /**
   * Confirm if this character can cast a spell.
   *
   * @param {string} type - The type of the spell to cast.
   *
   * @return {boolean}
   */
  canCastSpell(type) {
    if ( ! this.knowsSpell(type)) {
      return false;
    }

    const spell = Spells.new(type);

    // A few extra checks in combat
    if (CHARACTER_STATE.FIGHTING) {
      // Can't cast spells when stunned
      if (this.hasFlag(FLAGS.STUNNED_TURNS)) {
        return false;
        // Can't cast spells if not enough stamina to cast it
      }
      else if (spell.staminaCost > this.stamina) {
        return false;
      }
    }

    return spell.getMpCost(this) <= this.mp && ! this.profession.isSpellForbidden(spell);
  }

  /**
   * Get the error that describes why the character can't use the current spell.
   *
   * @param {string} type - The type of the spell that cannot be cast.
   *
   * @return {string}
   */
  spellCastErrorText(spellType) {
    if (spellType === false || ! this.knowsSpell(spellType)) {
      return "You don't know that spell.";
    }

    const spell = Spells.new(spellType);

    if (CHARACTER_STATE.FIGHTING === this.state) {
      if (this.hasFlag(FLAGS.STUNNED_TURNS)) {
        return "You can't cast spells while stunned.";
      }
      else if (0 === this.stamina) {
        return "You require more Stamina to cast spells.";
      }
    }

    if (spell.getMpCost(this) > this.mp) {
      return `You don't have enough MP to cast ${spell.getDisplayName(this)}.`;
    }

    if (this.profession.isSpellForbidden(spell)) {
      return `'${spell.getDisplayName(this)}' is forbidden to your profession.`;
    }

    Log.error(`Cannot cast '${spell.getDisplayName(this)}' but don't know why.`);
    return `You can't cast '${spell.getDisplayName(this)}', but you don't know why.`;
  }

  /**
   * If this character can perform an attack right now.
   *
   * @param {array} properties - The properties of the skill or attack being considered for the attack.
   *
   * @return {boolean}
   */
  canAttack(properties = []) {
    if (this.hasFlag(FLAGS.IS_JAMMED)) {
      return false;
    }
    else if ( ! properties.includes(PROPERTIES.DOES_NOT_NEED_AMMO) && this.weapon.needsReloading(this)) {
      return false;
    }

    return true;
  }

  /**
   * Perform the indicated fight action, and send back the messages resulting from it.
   *
   * @param {object} info - Information about the action taken by the character.
   *
   * @return {array}
   */
  doFightAction(info) {
    // If attacking
    if (info.action === FIGHT_ACTIONS.ATTACK) {
      return this.profession.doAttack(this);
    }

    // If clearing a jam
    else if (info.action === FIGHT_ACTIONS.CLEAR_JAM) {
      return this.clearJam();
    }

    // If reloading
    else if (info.action === FIGHT_ACTIONS.RELOAD) {
      return this.weapon.doReload(this);
    }

    // If defending
    else if (info.action === FIGHT_ACTIONS.DEFEND) {
      return this.profession.doDefend(this);
    }

    // If using an item
    else if (info.action === FIGHT_ACTIONS.ITEM) {
      this.stamina--;
      return Items.new(info.item).consume(this);
    }

    // If using a skill
    else if (info.action === FIGHT_ACTIONS.SKILL) {
      return this.profession.doSkill(this, info.skill);
    }

    // If casting a spell
    else if ([FIGHT_ACTIONS.BATTLECAST, FIGHT_ACTIONS.CAST].includes(info.action)) {
      if (FIGHT_ACTIONS.BATTLECAST === info.action) {
        this.setFlag(FLAGS.IS_BATTLECASTING);
      }

      let messages = Spells.new(info.spell).castFighting(this);

      if (this.hasFlag(FLAGS.IS_FOCUSED)) {
        this.clearFlag(FLAGS.IS_FOCUSED);
        messages.push("Your focus fades.");
      }

      if (FIGHT_ACTIONS.BATTLECAST === info.action) {
        this.clearFlag(FLAGS.IS_BATTLECASTING);

        if (this.enemy.isTired()) {
          messages.push(`${this.enemy.getDisplayName(this)} ${this.enemy.isAre} tired, and you manage to battlecast your spell at no mana cost!`);
        }
        else {
          messages.push(`${this.enemy.getDisplayName(this)} ${this.enemy.isAre === 'is' ? "isn't" : "aren't"} tired, and interrupts your battlecasting, so your spell costs the same mana as normal.`);
        }
      }

      this.stamina--;

      return messages;
    }

    // If equipping a new item
    else if (info.action === FIGHT_ACTIONS.EQUIP) {
      return this.equipment.equip(this, info.item);
    }

    // If running
    else if (info.action === FIGHT_ACTIONS.RUN) {
      return Combat.doRun(this);
    }

    // Do nothing: Can always do this
    else if (info.action === FIGHT_ACTIONS.DO_NOTHING) {
      return [":sleeping: You are stunned and can do nothing."];
    }

    // An action specific to an enemy
    else if (info.action === FIGHT_ACTIONS.ENEMY_ACTION) {
      return this.enemy.doCharacterFightAction(this, info.type, info);
    }

    // Uncrecognized action
    else {
      throw new Error(`Unrecognized fight action: '${info.action}'`);
    }
  }

  /**
   * Attempt to clear a jammed weapon.
   *
   * @return {array}
   */
  clearJam() {
    const gunName = this.weapon.getDisplayName(this);

    // 50% chance of clearing a jam
    if (Random.between(1, 2) === 1) {
      this.clearFlag(FLAGS.IS_JAMMED);

      return [Random.fromArray([
        `Through brute force more than skill, you manage to clear your jammed ${gunName}.`,
        `You expertly clear the jam in your ${gunName}.`,
        `You clear a stuck casing from the chamber of your ${gunName}.`,
      ])];
    }

    return [Random.fromArray([
      `Seething with frustration, you fruitlessly fail to clear the jam in your ${gunName}.`,
      `You try to clear the jam in your ${gunName}, but ${this.enemy.getDisplayName(this)} just won't give you a clear moment to concentrate!`,
      "Huh, there's a cartridge stuck _way_ in there!  Try as you might, you can't clear it.",
    ])];
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
    attackInfo = this.profession.doAttackerPostAttackProcessing(attackInfo, this, defender);
    attackInfo = this.weapon.doAttackerPostAttackProcessing(attackInfo, this, defender);

    if (attackInfo.didCrit) {
      // Master Gladiators get bonus crit damage
      if (this.hasMasteredProfession(PROFESSIONS.GLADIATOR)) {
        const gladiatorProfession = Professions.new(PROFESSIONS.GLADIATOR);
        attackInfo.damage = Math.ceil(attackInfo.damage * gladiatorProfession.getMasteryBonus(this));
      }
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
    // If character is defending, receive half damage
    if (this.hasFlag(FLAGS.IS_DEFENDING)) {
      let defendReduction = DEFEND_REDUCTION;

      // Master Mist Dancers take less damage while defending
      if (this.hasMasteredProfession(PROFESSIONS.MIST_DANCER)) {
        const mistDancerProfession = Professions.new(PROFESSIONS.MIST_DANCER);
        defendReduction -= DEFEND_REDUCTION * mistDancerProfession.getMasteryBonus(this);
      }

      attackInfo.damage = Math.ceil(attackInfo.damage * defendReduction);
    }

    return this.profession.doDefenderPostAttackProcessing(attackInfo, this, attacker);
  }

  /**
   * Allow attack parameters to be modified before being used in an attack.
   *
   * @param {object} params - The parameters to modify.
   * @param {Combatant} defender - The defender of the attack.
   *
   * @return {object}
   */
  attackerModifyAttackParameters(params, defender) {
    return this.profession.attackerModifyAttackParameters(params, defender, this);
  }

  /**
   * Allow attack parameters to be modified before being used in an attack.
   *
   * @param {object} params - The parameters to modify.
   * @param {Combatant} attacker - The attacker.
   *
   * @return {object}
   */
  defenderModifyAttackParameters(params, attacker) {
    return this.profession.defenderModifyAttackParameters(params, attacker, this);
  }

  /**
   * Perform any actions that happen after the round (decrement/clear all timers, etc)
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(opponent) {
    const enemy = this.enemy;

    let messages = super.doPostRoundActions(opponent);
    messages = messages.concat(this.weapon.doPostRoundActions(this));
    messages = messages.concat(this.relic.doPostRoundActions(this));
    messages = messages.concat(this.armour.doPostRoundActions(this));
    messages = messages.concat(this.accessory.doPostRoundActions(this));
    messages = messages.concat(this.pet.doPostRoundActions(this));
    messages = messages.concat(this.profession.doPostRoundActions(this));

    // Last turn of Enfeeble spell?
    if (enemy.hasFlag(FLAGS.FEEBLE_TURNS) && 1 === enemy.getFlag(FLAGS.FEEBLE_TURNS)) {
      messages.push("Your enfeeble spell falters, and your opponent regains their strength.");
    }

    // Enemy in a poison cloud?
    if (enemy.hasFlag(FLAGS.POISON_CLOUD_TURNS)) {
      const turns = enemy.getFlag(FLAGS.POISON_CLOUD_TURNS) - 1;
      const elapsed = TURNS_POISON_CLOUD - turns;

      const spellDamage = enemy.getFlag(FLAGS.POISON_CLOUD_DAMAGE);
      let damage = Math.ceil(spellDamage * elapsed / TURNS_POISON_CLOUD / 2);

      // Is enemy a group?  Take bonus damage!
      if (enemy.properties.includes(PROPERTIES.IS_GROUP)) {
        damage = Math.ceil(damage * AOE_BONUS);
      }

      enemy.decreaseHp(damage);

      messages.push(`:cloud: Your poison cloud grows larger, dealing ${damage} damage to ${enemy.getDisplayName(this)}.`);

      if (enemy.properties.includes(PROPERTIES.IS_GROUP)) {
        messages.push(`${enemy.getDisplayName(this)} takes extra damage from your area of effect attack!`);
      }

      if (0 === turns) {
        messages.push("With that, your poison cloud has dispersed too much to do further damage.");
        enemy.clearFlag(FLAGS.POISON_CLOUD_DAMAGE);
      }
    }

    return messages;
  }

  /**
   * If the character has a curse from a Cursed Chest.
   *
   * @return {boolean}
   */
  hasChestCurse() {
    return this.hasFlag(FLAGS.CHEST_CURSE_FRAILTY) || this.hasFlag(FLAGS.CHEST_CURSE_CLUMSY);
  }

  /**
   * Return attachment info to display the message about the current chest curse.
   *
   * @return {string}
   */
  getChestCurseAttachment() {
    if (this.hasFlag(FLAGS.CHEST_CURSE_FRAILTY)) {
      const turns = this.getFlag(FLAGS.CHEST_CURSE_FRAILTY);

      if (turns === 1) {
        return {
          title: "Your breathing is easing and your muscles are feeling firmer.  The frailty curse will only last for one more Action Point!",
          color: COLORS.GOOD,
        };
      }

      return {
        title: `Your body continues to feel frail and miserable.  You estimate the effects will last through ${turns} more Action Points.`,
        color: COLORS.WARNING,
      };
    }

    if (this.hasFlag(FLAGS.CHEST_CURSE_CLUMSY)) {
      const turns = this.getFlag(FLAGS.CHEST_CURSE_CLUMSY);

      if (turns === 1) {
        return {
          title: "You can feel your coordination returning to you.  The clumsiness curse will only last for one more Action Point!",
          color: COLORS.GOOD,
        };
      }
      return {
        title: `Performing simple tasks without dropping things is nearly impossible.  You estimate the effects will last through ${turns} more Action Points.`,
        color: COLORS.WARNING,
      };
    }

    throw new Error("No chest curse to get attachment info for.");
  }

  /**
   * Perform any actions that need to happen at the start of a fight turn.
   *
   * @param {array} messages - Messages to add to.
   *
   * @return {array}
   */
  doFightTurnStart(messages) {
    messages = this.location.doFightTurnStart(this, messages);
    messages = this.enemy.doFightTurnStart(this, messages);

    return messages;
  }

  /**
   * Perform any actions that need to happen at the end of a fight turn.
   *
   * @param {array} messages - Messages to add to.
   *
   * @return {array}
   */
  doFightTurnEnd(messages) {
    messages = this.location.doFightTurnEnd(this, messages);
    messages = this.enemy.doFightTurnEnd(this, messages);

    return messages;
  }

  /**
   * Perform wrap-up tasks that have to happen before stats, etc are affected.
   *
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightWrapUp(messages) {
    messages = this.profession.doFightWrapUp(this, messages);
    messages = this.weapon.doFightWrapUp(this, messages);
    messages = this.enemy.doFightWrapUp(this, messages);
    messages = this.location.doFightWrapUp(this, messages);

    return messages;
  }

  /**
   * Perform any post-fight actions that always happen.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(messages) {
    messages = this.profession.doFightEnd(this, messages);
    messages = this.weapon.doFightEnd(this, messages);
    messages = this.enemy.doFightEnd(this, messages);
    messages = this.location.doFightEnd(this, messages);

    return messages;
  }

  /**
   * Do any extra actions required when running.
   *
   * @param {array} message - The previously-generated messages.
   *
   * @return {array}
   */
  doFightRun(messages) {
    messages = this.enemy.doFightRun(this, messages);
    messages = this.profession.doFightRun(this, messages);

    return messages;
  }

  /**
   * Perform any post-fight success actions and return the messages arising from them.
   *
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightSuccess(messages) {
    messages = this.profession.doFightSuccess(this, messages);
    messages = this.enemy.doFightSuccess(this, messages);
    messages = this.location.doFightSuccess(this, messages);
    messages = this.pet.doFightSuccess(this, messages);

    if (this.party) {
      messages = this.party.doFightSuccess(this, messages);
    }

    // Having a boost grants +1 SP
    if (this.hasBoost('party-1_sp')) {
      messages.push('You gain +1 SP from your Party +1 SP Boost.');
    }

    if (this.spWasDoubled) {
      messages.push('Your SP is doubled from being Well Rested!');
    }

    return messages;
  }

  /**
   * Perform any post-fight failure actions and return the messages arising from them.
   *
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightFailure(messages) {
    messages = this.profession.doFightFailure(this, messages);
    messages = this.enemy.doFightFailure(this, messages);
    messages = this.location.doFightFailure(this, messages);

    return messages;
  }
}

module.exports = {
  Character
};