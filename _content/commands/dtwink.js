"use strict";

const moment = require('moment');

const Command     = require('@app/content/commands').Command;
const Character   = require('@app/character').Character;
const Locations   = require('@app/content/locations').Locations;
const Items       = require('@app/content/items').Items;
const Professions = require('@app/content/professions').Professions;
const Profession  = require('@app/content/professions').Profession;

const STATS           = require('@constants').STATS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

/**
 * Twink a character to a specific power level.
 * (Developer command!)
 */
class DeveloperTwinkCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    const connection = await DB_POOL.getConnection();

    const twinkFunction = this.getTwinkFunction(this.info.text);

    if ( ! twinkFunction) {
      this.character.slashbot.say(":warning: Not a valid label.", this.character);
      return await this.doLook();
    }

    let character = new Character();
    character.slashbot = this.character.slashbot;
    await this.resetCharacter(this.character, connection);
    await character.load({ uid: this.character.uid }, character.slashbot);
    character.queueSuffix = this.character.queueSuffix;

    this.setCommon(character);
    await twinkFunction(character, connection);

    character._isLoading = false;
    await character.save();
    this.character = character;

    connection.release();

    character.slashbot.say(":dark_sunglasses: Character twinked.", this.character);
    await this.doLook();
  }

  /**
   * Get the twink function for the provided label.
   *
   * @param {string} label - The label to get the twink function for.
   *
   * @return {string}
   */
  getTwinkFunction(label) {
    switch (label) {
      case 'watermoon-start': return this.watermoonStart.bind(this);
      case 'watermoon-faith': return this.watermoonFaithBoss.bind(this);
      case 'watermoon-shadow': return this.watermoonShadowBoss.bind(this);
      case 'watermoon-death': return this.watermoonDeathBoss.bind(this);
      case 'watermoon-necrodragon': return this.watermoonNecrodragon.bind(this);
      case 'watermoon-23': return this.watermoon23.bind(this);
      case 'watermoon-26': return this.watermoon26.bind(this);
      case 'watermoon-28': return this.watermoon28.bind(this);
      case 'watermoon-30': return this.watermoon30.bind(this);
      case 'watermoon-33': return this.watermoon33.bind(this);
      case 'watermoon-36': return this.watermoon36.bind(this);
      case 'watermoon-38': return this.watermoon38.bind(this);
      case 'watermoon-40': return this.watermoon40.bind(this);
      case 'watermoon-43': return this.watermoon43.bind(this);
      case 'watermoon-46': return this.watermoon46.bind(this);
      case 'watermoon-48': return this.watermoon48.bind(this);
      case 'watermoon-50': return this.watermoon50.bind(this);
      default: return false;
    }
  }

  /**
   * Reset the current character.
   *
   * @param {Character} character - The character to reset.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async resetCharacter(character, connection) {
    await connection.query('DELETE FROM characters WHERE uid = ?', [character.uid]);

    await Character.create(character.uid, character.teamid, character.getDisplayName(), character.email, character.channel);
  }

  /**
   * Set common character values.
   *
   * @param {Character} character - The character to set values for.
   */
  setCommon(character) {
    character._isLoading = true;

    character.location = Locations.new("stagecoach");
    character.state    = CHARACTER_STATE.IDLE;

    character.xp      = 0;
    character._gold   = 1000;

    character.ap     = 5;
    character.lastAp = moment().format('YYYY-MM-DD H:mm:ss');

    character.updateAp();

    character.updatedAt = moment().format('YYYY-MM-DD H:mm:ss');
    character._stamina  = 0;

    character._flags = {};
    character._stats = {};

    character.inventory.add('torch', 50);
    character.inventory.add('consumables-potion', 20);
    character.inventory.add('consumables-elixir', 20);
    character.setStat(STATS.SCATTERSLIDE_INTRO);
  }

  /**
   * Set the character to the start of Watermoon, no WM dragons defeated, simple equipment,
   * located at Stagecoach, ready to go.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoonStart(character, connection) {
    character.level = 20;
    character.scales = 8;

    character._force      = 32;
    character._technique  = 31;
    character._defence    = 72;
    character._crit       = 10;
    character._dodge      = 10;
    character._spellPower = 37;

    character._maxHp     = 510;
    character._hp        = character.maxHp;
    character.maxMp      = 270;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-019_blackiron_mace");
    character.relic     = Items.new("equipment-relics-016_silver_blasting_rod");
    character.armour    = Items.new("equipment-armour-019_fullscale");
    character.accessory = Items.new("equipment-accessories-watermoon-020_inlaid_copper_bangle");
    character.pet       = Items.new("equipment-pets-midnight");

    character.knownSpells = ["cinders","scry","icicle","cure","open_wounds","poison_cloud","enfeeble"];

    character.setStat('mies_killed', 1, 'tyrose-lair-green_dragon');
    character.setStat('enemies_killed', 1, 'scatterslide-brown_dragon');

    await this.trainProfession(character, "novice", connection);
    await this.trainProfession(character, "tier_1-bard", connection);
    await this.trainProfession(character, "tier_1-caravan_guard", connection);
    await this.trainProfession(character, "tier_1-mercenary", connection);

    await Profession.load(character, "tier_1-caravan_guard", connection);
    character.supportProfession = "";
  }

  /**
   * Ready to fight the Mystic Shadow boss.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoonFaithBoss(character, connection) {
    character.level = 22;
    character.scales = 8;

    character._force      = 35;
    character._technique  = 32;
    character._defence    = 110;
    character._crit       = 15;
    character._dodge      = 10;
    character._spellPower = 48;

    character._maxHp     = 485;
    character._hp        = character.maxHp;
    character.maxMp      = 255;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-axes-023_cruel_handaxe");
    character.relic     = Items.new("equipment-relics-018_jeweled_blasting_rod");
    character.armour    = Items.new("equipment-armour-heavy-022_dented_plate");
    character.accessory = Items.new("equipment-accessories-015_chunky_iron_bracelet");
    character.pet       = Items.new("equipment-pets-midnight");

    character.inventory.add('tool-dowsing_staff');

    character.profession = Professions.new('tier_2-gladiator');

    character.knownSpells = ["cinders","scry","icicle","cure","open_wounds","poison_cloud","enfeeble"];

    character.setStat('enemies_killed', 1, 'tyrose-lair-green_dragon');
    character.setStat('enemies_killed', 1, 'scatterslide-brown_dragon');

    character.location = Locations.new("watermoon-mystic-plane_of_faith");

    character.setStat(STATS.WATERMOON_INTRO);
    character.setFlag("faith_direction", "north");
    character.setFlag("faith_portal_open", true);
    character.setFlag("faith_plane_layout", 0);
    character.setFlag("faith_location", { "x": 1, "y": 1 });
    character.setFlag("faith_boss_location", { "x": 1, "y": 1 });

    await this.trainProfession(character, "novice", connection);
    await this.trainProfession(character, "tier_1-bard", connection);
    await this.trainProfession(character, "tier_1-caravan_guard", connection);
    await this.trainProfession(character, "tier_1-mercenary", connection);

    await Profession.load(character, "tier_1-caravan_guard", connection);
    character.supportProfession = "";
  }

  /**
   * Ready to fight the Mystic Shadow boss.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoonShadowBoss(character, connection) {
    character.level = 25;
    character.scales = 8;

    character._force      = 40;
    character._technique  = 35;
    character._defence    = 130;
    character._crit       = 15;
    character._dodge      = 10;
    character._spellPower = 54;

    character._maxHp     = 520;
    character._hp        = character.maxHp;
    character.maxMp      = 275;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-axes-028_serrated_splitaxe");
    character.relic     = Items.new("equipment-relics-018_jeweled_blasting_rod");
    character.armour    = Items.new("equipment-armour-heavy-025_beaten_plate");
    character.accessory = Items.new("equipment-accessories-015_chunky_iron_bracelet");
    character.pet       = Items.new("equipment-pets-midnight");

    character.inventory.add('tool-dowsing_staff');

    character.knownSpells = ["cinders","scry","icicle","cure","open_wounds","poison_cloud","enfeeble"];

    character.inventory.add('quest-watermoon-faith_soul_gem', 1);

    character.setStat('enemies_killed', 1, 'tyrose-lair-green_dragon');
    character.setStat('enemies_killed', 1, 'scatterslide-brown_dragon');
    character.setStat('enemies_killed', 1, 'watermoon-mystic-faith-boss');

    character.location = Locations.new("watermoon-mystic-plane_of_shadow");

    character.setStat(STATS.WATERMOON_INTRO);
    character.setFlag("shadow_direction", "north");
    character.setFlag("shadow_portal_open", true);
    character.setFlag("shadow_plane_layout", 0);
    character.setFlag("shadow_location", { "x": 1, "y": 1 });
    character.setFlag("shadow_boss_location", { "x": 1, "y": 1 });

    await this.trainProfession(character, "novice", connection);
    await this.trainProfession(character, "tier_1-bard", connection);
    await this.trainProfession(character, "tier_1-caravan_guard", connection);
    await this.trainProfession(character, "tier_1-mercenary", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);

    await Profession.load(character, "tier_2-gladiator", connection);
    character.supportProfession = "";
  }

  /**
   * Ready to fight the Mystic Shadow boss.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoonDeathBoss(character, connection) {
    character.level = 30;
    character.scales = 8;

    character._force      = 45;
    character._technique  = 45;
    character._defence    = 185;
    character._crit       = 15;
    character._dodge      = 10;
    character._spellPower = 66;

    character._maxHp     = 595;
    character._hp        = character.maxHp;
    character.maxMp      = 325;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-hidden_daggers-030_blacksteel_beltknife");
    character.relic     = Items.new("equipment-relics-018_jeweled_blasting_rod");
    character.armour    = Items.new("equipment-armour-heavy-029_shined_plate");
    character.accessory = Items.new("equipment-accessories-015_chunky_iron_bracelet");
    character.pet       = Items.new("equipment-pets-midnight");

    character.inventory.add('tool-dowsing_staff');

    character.knownSpells = ["cinders","scry","icicle","cure","open_wounds","poison_cloud","enfeeble"];

    character.inventory.add('quest-watermoon-faith_soul_gem', 1);
    character.inventory.add('quest-watermoon-shadow_soul_gem', 1);

    character.setStat('enemies_killed', 1, 'tyrose-lair-green_dragon');
    character.setStat('enemies_killed', 1, 'scatterslide-brown_dragon');
    character.setStat('enemies_killed', 1, 'watermoon-mystic-faith-boss');
    character.setStat('enemies_killed', 1, 'watermoon-mystic-shadow-boss');

    character.location = Locations.new("watermoon-mystic-plane_of_death");

    character.setStat(STATS.WATERMOON_INTRO);
    character.setFlag("death_direction", "north");
    character.setFlag("death_portal_open", true);
    character.setFlag("death_plane_layout", 0);
    character.setFlag("death_location", { "x": 1, "y": 1 });
    character.setFlag("death_boss_location", { "x": 1, "y": 1 });

    await this.trainProfession(character, "novice", connection);
    await this.trainProfession(character, "tier_1-bard", connection);
    await this.trainProfession(character, "tier_1-caravan_guard", connection);
    await this.trainProfession(character, "tier_1-mercenary", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);
    await this.trainProfession(character, "tier_2-mist_dancer", connection);

    await Profession.load(character, "tier_2-mist_dancer", connection);
    character.supportProfession = "";
  }

  /**
   * Ready to fight the Necrodragon.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoonNecrodragon(character, connection) {
    character.level = 30;
    character.scales = 8;

    character._force      = 45;
    character._technique  = 45;
    character._defence    = 185;
    character._crit       = 15;
    character._dodge      = 10;
    character._spellPower = 66;

    character._maxHp     = 595;
    character._hp        = character.maxHp;
    character.maxMp      = 325;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-hidden_daggers-030_blacksteel_beltknife");
    character.relic     = Items.new("equipment-relics-018_jeweled_blasting_rod");
    character.armour    = Items.new("equipment-armour-heavy-029_shined_plate");
    character.accessory = Items.new("equipment-accessories-015_chunky_iron_bracelet");
    character.pet       = Items.new("equipment-pets-midnight");

    character.inventory.add('tool-dowsing_staff');

    character.knownSpells = ["cinders","scry","icicle","cure","open_wounds","poison_cloud","enfeeble"];

    character.inventory.add('quest-watermoon-faith_soul_gem', 1);
    character.inventory.add('quest-watermoon-shadow_soul_gem', 1);

    character.setStat('enemies_killed', 1, 'tyrose-lair-green_dragon');
    character.setStat('enemies_killed', 1, 'scatterslide-brown_dragon');
    character.setStat('enemies_killed', 1, 'watermoon-mystic-faith-boss');
    character.setStat('enemies_killed', 1, 'watermoon-mystic-shadow-boss');

    character.location = Locations.new("watermoon-mystic-catacombs");

    character.setStat(STATS.WATERMOON_INTRO);
    character.setFlag("catacombs_open", true);

    await this.trainProfession(character, "novice", connection);
    await this.trainProfession(character, "tier_1-bard", connection);
    await this.trainProfession(character, "tier_1-caravan_guard", connection);
    await this.trainProfession(character, "tier_1-mercenary", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);
    await this.trainProfession(character, "tier_2-mist_dancer", connection);

    await Profession.load(character, "tier_2-mist_dancer", connection);
    character.supportProfession = "";
  }

  /**
   * Train a profession fully.
   *
   * @param {Character} character - The character being trained.
   * @param {string} professionType - The type of the profession being trained.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async trainProfession(character, professionType, connection) {
    let profession = Professions.new(professionType);

    const stats = profession.getStats();
    for (const type in stats) {
      profession.trained[type] = stats[type].costs.length;
    }

    const skills = profession.getSkills(character);
    for (const type in skills) {
      if (_.isDefined(skills[type].spCost)) {
        profession.trained[type] = true;
      }
    }

    character.setStat(STATS.PROFESSION_MASTERY, 1, profession.type);
    profession.trained["mastery"] = true;

    profession.spSpent = profession.maxSp;
    await profession.performMasteryActions(character);

    await profession.save(character.id, connection);
  }

  /**
   * Set the common variables for setting Watermoon testing levels.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoonCommon(character, connection) {
    character.knownSpells = [
      'hoarfrost_spike',
      'windwall',
      'enrage',
      'enfeeble',
      'teleport',
      'cure',
      'cinders',
      'scry',
      'icicle',
      'open_wounds',
      'poison_cloud',
    ];

    character._crit  = 10;
    character._dodge = 10;

    character.setStat('enemies_killed', 1, 'tyrose-lair-green_dragon');
    character.setStat('enemies_killed', 1, 'scatterslide-brown_dragon');

    character.pet = Items.new("equipment-pets-midnight");

    await this.trainProfession(character, "novice", connection);
    await this.trainProfession(character, "tier_1-bard", connection);
    await this.trainProfession(character, "tier_1-caravan_guard", connection);
    await this.trainProfession(character, "tier_1-mercenary", connection);

    character.supportProfession = "";

    character.location = Locations.new("watermoon-fountain");

    character.inventory.add('tool-dowsing_staff');

    character.setStat(STATS.WATERMOON_INTRO);

    character.setStat('enemies_killed', 1, 'tyrose-lair-green_dragon');
    character.setStat('enemies_killed', 1, 'scatterslide-brown_dragon');
  }

  /**
   * Watermoon, level 23.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon23(character, connection) {
    await this.watermoonCommon(character, connection);

    character.level = 23;

    character._force      = 38;
    character._technique  = 38;
    character._defence    = 93;
    character._spellPower = 81;

    character._maxHp     = 560;
    character._hp        = character.maxHp;
    character.maxMp      = 250;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-guns-023_s22");
    character.relic     = Items.new("equipment-relics-021_bone_ritual_knife");
    character.armour    = Items.new("equipment-armour-arcane-022_apprentices_robe");
    character.accessory = Items.new("equipment-accessories-watermoon-020_inlaid_copper_bangle");

    character.setFlag("ammo_count", 6);

    let profession = Professions.new('tier_2-battle_witch');
    await profession.save(character.id, connection);
    character.profession = await Profession.load(character, "tier_2-battle_witch", connection);
  }

  /**
   * Watermoon, level 26.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon26(character, connection) {
    await this.watermoonCommon(character, connection);

    character.level = 26;

    character._force      = 46;
    character._technique  = 46;
    character._defence    = 106;
    character._spellPower = 91;

    character._maxHp     = 625;
    character._hp        = character.maxHp;
    character.maxMp      = 300;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-guns-026_p25");
    character.relic     = Items.new("equipment-relics-024_rosewood_ritual_knife");
    character.armour    = Items.new("equipment-armour-arcane-025_embroidered_robe");
    character.accessory = Items.new("equipment-accessories-watermoon-020_inlaid_copper_bangle");

    character.setFlag("ammo_count", 7);

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    character.profession = await Profession.load(character, "tier_2-battle_witch", connection);
  }

  /**
   * Watermoon, level 28.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon28(character, connection) {
    await this.watermoonCommon(character, connection);

    character.level = 28;

    character._force      = 48;
    character._technique  = 48;
    character._defence    = 118;
    character._spellPower = 99;

    character._maxHp     = 635;
    character._hp        = character.maxHp;
    character.maxMp      = 300;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-guns-028_s26");
    character.relic     = Items.new("equipment-relics-026_jade_ritual_knife");
    character.armour    = Items.new("equipment-armour-arcane-027_reinforced_robe");
    character.accessory = Items.new("equipment-accessories-watermoon-020_inlaid_copper_bangle");

    character.setFlag("ammo_count", 9);

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    character.profession = await Profession.load(character, "tier_2-battle_witch", connection);
  }

  /**
   * Watermoon, level 30.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon30(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');

    character.level = 30;

    character._force      = 50;
    character._technique  = 50;
    character._defence    = 135;
    character._spellPower = 107;

    character._maxHp     = 695;
    character._hp        = character.maxHp;
    character.maxMp      = 300;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-guns-030_p28");
    character.relic     = Items.new("equipment-relics-028_obsidian_ritual_knife");
    character.armour    = Items.new("equipment-armour-arcane-029_runed_robe");
    character.accessory = Items.new("equipment-accessories-watermoon-030_delicate_silver_wristlet");

    character.setFlag("ammo_count", 16);

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    character.profession = await Profession.load(character, "tier_2-battle_witch", connection);
  }

  /**
   * Watermoon, level 33.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon33(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');

    character.level = 33;

    character._force      = 53;
    character._technique  = 53;
    character._defence    = 198;
    character._spellPower = 97;
    character._crit       = 15;

    character._maxHp     = 710;
    character._hp        = character.maxHp;
    character.maxMp      = 300;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-axes-033_sharpened_cleaver");
    character.relic     = Items.new("equipment-relics-031_brass_chalice");
    character.armour    = Items.new("equipment-armour-heavy-032_ancient_plate");
    character.accessory = Items.new("equipment-accessories-watermoon-030_delicate_silver_wristlet");

    await this.trainProfession(character, "tier_2-battle_witch", connection);

    let profession = Professions.new('tier_2-gladiator');
    await profession.save(character.id, connection);
    character.profession = await Profession.load(character, "tier_2-gladiator", connection);
  }

  /**
   * Watermoon, level 36.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon36(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');

    character.level = 36;

    character._force      = 61;
    character._technique  = 56;
    character._defence    = 226;
    character._spellPower = 103;
    character._crit       = 15;

    character._maxHp     = 775;
    character._hp        = character.maxHp;
    character.maxMp      = 350;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-axes-036_heavy_hacker");
    character.relic     = Items.new("equipment-relics-034_cunife_chalice");
    character.armour    = Items.new("equipment-armour-heavy-035_restored_plate");
    character.accessory = Items.new("equipment-accessories-watermoon-030_delicate_silver_wristlet");

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);

    character.profession = await Profession.load(character, "tier_2-gladiator", connection);
  }

  /**
   * Watermoon, level 38.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon38(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');

    character.level = 38;

    character._force      = 63;
    character._technique  = 58;
    character._defence    = 248;
    character._spellPower = 107;
    character._crit       = 15;

    character._maxHp     = 785;
    character._hp        = character.maxHp;
    character.maxMp      = 350;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-axes-038_the_carver");
    character.relic     = Items.new("equipment-relics-036_silver_chalice");
    character.armour    = Items.new("equipment-armour-heavy-037_reinforced_plate");
    character.accessory = Items.new("equipment-accessories-watermoon-030_delicate_silver_wristlet");

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);

    character.profession = await Profession.load(character, "tier_2-gladiator", connection);
  }

  /**
   * Watermoon, level 40.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon40(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');
    character.knownSpells.unshift('lightning_strike');

    character.level = 40;

    character._force      = 65;
    character._technique  = 60;
    character._defence    = 270;
    character._spellPower = 111;
    character._crit       = 15;

    character._maxHp     = 845;
    character._hp        = character.maxHp;
    character.maxMp      = 350;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-axes-040_two_handed_battleaxe");
    character.relic     = Items.new("equipment-relics-038_rose_gold_chalice");
    character.armour    = Items.new("equipment-armour-heavy-039_fortified_plate");
    character.accessory = Items.new("equipment-accessories-watermoon-040_powerful_gold_armband");

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);

    character.profession = await Profession.load(character, "tier_2-gladiator", connection);
  }

  /**
   * Watermoon, level 43.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon43(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');
    character.knownSpells.unshift('lightning_strike');

    character.level = 43;

    character._force      = 68;
    character._technique  = 63;
    character._defence    = 233;
    character._spellPower = 117;
    character._dodge      = 16;

    character._maxHp     = 860;
    character._hp        = character.maxHp;
    character.maxMp      = 350;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-hidden_daggers-043_pocket_penknife");
    character.relic     = Items.new("equipment-relics-041_maple_staff");
    character.armour    = Items.new("equipment-armour-quick-042_snake_leather");
    character.accessory = Items.new("equipment-accessories-watermoon-040_powerful_gold_armband");

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);

    let profession = Professions.new('tier_2-mist_dancer');
    await profession.save(character.id, connection);
    character.profession = await Profession.load(character, "tier_2-mist_dancer", connection);
  }

  /**
   * Watermoon, level 46.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon46(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');
    character.knownSpells.unshift('lightning_strike');

    character.level = 46;

    character._force      = 71;
    character._technique  = 71;
    character._defence    = 261;
    character._spellPower = 123;
    character._dodge      = 16;

    character._maxHp     = 925;
    character._hp        = character.maxHp;
    character.maxMp      = 400;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-hidden_daggers-046_elbow_dagger");
    character.relic     = Items.new("equipment-relics-044_mahogany_staff");
    character.armour    = Items.new("equipment-armour-quick-045_alligator_leather");
    character.accessory = Items.new("equipment-accessories-watermoon-040_powerful_gold_armband");

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);
    await this.trainProfession(character, "tier_2-mist_dancer", connection);
    character.profession = await Profession.load(character, "tier_2-mist_dancer", connection);
  }

  /**
   * Watermoon, level 48.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon48(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');
    character.knownSpells.unshift('lightning_strike');

    character.level = 48;

    character._force      = 73;
    character._technique  = 73;
    character._defence    = 283;
    character._spellPower = 127;
    character._dodge      = 17;

    character._maxHp     = 935;
    character._hp        = character.maxHp;
    character.maxMp      = 400;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-hidden_daggers-048_flexible_edge");
    character.relic     = Items.new("equipment-relics-046_snakewood_staff");
    character.armour    = Items.new("equipment-armour-quick-047_bear_leather");
    character.accessory = Items.new("equipment-accessories-watermoon-040_powerful_gold_armband");

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);
    await this.trainProfession(character, "tier_2-mist_dancer", connection);
    character.profession = await Profession.load(character, "tier_2-mist_dancer", connection);
  }

  /**
   * Watermoon, level 50.
   *
   * @param {Character} character - The character to twink.
   * @param {PromiseConnection} connection - The database connection to use.
   */
  async watermoon50(character, connection) {
    await this.watermoonCommon(character, connection);

    character.knownSpells.unshift('flame_jet');
    character.knownSpells.unshift('heal');
    character.knownSpells.unshift('lightning_strike');

    character.level = 50;

    character._force      = 75;
    character._technique  = 75;
    character._defence    = 305;
    character._spellPower = 138;
    character._dodge      = 17;

    character._maxHp     = 1045;
    character._hp        = character.maxHp;
    character.maxMp      = 400;
    character._mp        = character.maxMp;

    character.weapon    = Items.new("equipment-weapons-hidden_daggers-050_invisible_blades");
    character.relic     = Items.new("equipment-relics-048_blackwood_staff");
    character.armour    = Items.new("equipment-armour-quick-049_drake_leather");
    character.accessory = Items.new("equipment-accessories-watermoon-050_masterful_platinum_armlet");

    await this.trainProfession(character, "tier_2-battle_witch", connection);
    await this.trainProfession(character, "tier_2-gladiator", connection);
    await this.trainProfession(character, "tier_2-mist_dancer", connection);
    character.profession = await Profession.load(character, "tier_2-mist_dancer", connection);
  }
}

module.exports = DeveloperTwinkCommand;