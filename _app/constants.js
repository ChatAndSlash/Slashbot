"use strict";

const AP_MINUTES = 15;

const CHARACTER_STATE = {
  IDLE: 'idle',
  FIGHTING: 'fighting',
  WOUNDED: 'wounded',
  ENCOUNTER: 'encounter',
};

const COLORS = {
  GOOD: 'good',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: '#3AA3E3',
  PROPHECY: '#9C29BC',
  ZERO_AP: '#F0B27A',
};

const DIRECTIONS = {
  NORTH: 'north',
  EAST: 'east',
  WEST: 'west',
  SOUTH: 'south',
};

const REPUTATION_LEVELS = {
  ESTEEMED: 7500,
  RESPECTED: 5000,
  APPRECIATED: 3000,
  KNOWN: 1000,
  UNKNOWN: 0,
};

const FIGHT_ACTIONS = {
  ATTACK: 'attack',
  RELOAD: 'reload',
  CLEAR_JAM: 'clear_jam',
  DEFEND: 'defend',
  ITEMS: 'items',
  ITEM: 'item',
  SKILL: 'skill',
  BATTLECAST: 'battlecast',
  CAST: 'cast',
  EQUIP: 'equip',
  RUN: 'run',
  DO_NOTHING: 'do_nothing',
  ENEMY_ACTION: 'enemy_action',
};

const FLAGS = {
  // OOC statuses
  IN_CUTSCENE: 'in_cutscene',
  CINDERS_LIGHT_DURATION: 'cinders_light_duration',
  BOSS_DEFEATED_: 'boss_defeated_',

  // Premium flags
  AMBROSIA_FIGHT_USE: 'ambrosia_fight_use',
  GREETER_DELAY_UNTIL: 'greeter_delay_until',

  // Cursed Chest curses
  CHEST_CURSE_FIGHTS: 'chest_curse_fights',
  CHEST_CURSE_FRAILTY: 'chest_curse_frailty',
  CHEST_CURSE_CLUMSY: 'chest_curse_clumsy',

  // Events
  SPIRIT_DRAGON_FIGHTS: 'spirit_dragon_fights',

  // Misc combat statuses
  WELL_RESTED_TURNS: 'well_rested_turns',
  DAMAGE_MODIFIER: 'damage_modifer',
  CANNOT_CRIT: 'cannot_crit',
  CANNOT_DODGE: 'cannot_dodge',
  CANNOT_MISS: 'cannot_miss',
  CANNOT_CAST: 'cannot_cast',
  POISONED_TURNS: 'poisoned_turns',
  POISON_DAMAGE: 'poison_damage',
  STUNNED_TURNS: 'stunned_turns',
  STUN_COOLDOWN: 'stun_cooldown',
  TIRED_TURNS: 'tired_turns',
  FEEBLE_TURNS: 'feeble_turns',
  GUARANTEED_HIT_TURNS: 'guaranteed_hit_turns',
  POISON_CLOUD_TURNS: 'poison_cloud_turns',
  POISON_CLOUD_DAMAGE: 'poison_cloud_damage',
  DAZED_TURNS: 'dazed_turns',
  AMMO_COUNT: 'ammo_count',
  IS_RANGED: 'is_ranged',
  BURNED_TURNS: 'burned_turns',
  COLD_COMPRESS_TURNS: 'cold_compress_turns',
  CHILLED_TURNS: 'chilled_turns',
  HOT_CHOCOLATE_TURNS: 'hot_chocolate_turns',
  HAS_DAGGERS_HIDDEN: 'has_daggers_hidden',
  ACID_TURNS: 'acid_turns',
  ACID_DAMAGE: 'acid_damage',
  CURSED_TURNS: 'cursed_turns',
  BLIND_TURNS: 'blind_turns',
  CONCUSSED_TURNS: 'concussed_turns',
  ENRAGED_TURNS: 'enraged_turns',
  WINDWALL_TURNS: 'windwall_turns',
  WINDWALL_DAMAGE: 'windwall_damage',
  SKILL_SLOT_DISABLED_TURNS: 'skill_slot_disabled_turns',

  // Single-turn combat statuses
  IS_DEFENDING: 'is_defending',
  IS_FURIOUS: 'is_furious',
  IS_BREATHING_IN: 'is_breathing_in',
  IS_WEAKENED: 'is_weakened',
  IS_IGNORING_QUARTER_ARMOUR: 'is_ignoring_quarter_armour',
  IS_IGNORING_HALF_ARMOUR: 'is_ignoring_half_armour',
  IS_INVISIBLE: 'is_invisible',
  IS_BURROWED: 'is_burrowed',

  // Misc profession flags
  PROFESSION_SUBTYPE: 'profession_subtype',

  // Novice skills
  SOOTHED_TURNS: 'soothed_turns',  // Manually decremented in profession file so it can be applied post-fight success
  FIGHT_COOLDOWN_SOOTHE: 'fight_cooldown_soothe',

  // Bard skills
  IS_FOCUSED: 'is_focused',
  DISORIENTED_TURNS: 'disoriented_turns',
  IS_MISDIRECTING: 'is_misdirecting',
  FIGHT_COOLDOWN_INSPIRE: 'fight_cooldown_inspire',
  FIGHT_COOLDOWN_MORE_LUTE: 'fight_cooldown_more_lute',

  // Caravan Guard skills
  IS_CAUTIOUS: 'is_cautious',
  IS_GUARDING: 'is_guarding',
  IS_TRIPPING: 'is_tripping',
  RALLY_TEMP_HP: 'rally_temp_hp',
  FIGHT_COOLDOWN_RALLY: 'fight_cooldown_rally',

  // Mercenary skills
  IS_DISCIPLINED: 'is_disciplined',
  IS_EVADING: 'is_evading',
  DID_EVADE: 'did_evade',
  IS_FLURRYING: 'is_flurrying',

  // Battle Witch skills
  IS_BATTLECASTING: 'is_battlecasting',
  IS_ALPHA_STRIKING: 'is_alpha_striking',
  IS_JAMMED: 'is_jammed',

  // Mist Dancer skills
  INFLAMED_TURNS: 'inflamed_turns',
  IS_RIPOSTING: 'is_riposting',
  RIPOSTE_COOLDOWN_TURNS: 'riposte_cooldown_turns',
  IS_DISARMED: 'is_disarmed',
  FIGHT_COOLDOWN_MIST_BALM: 'fight_cooldown_mist_balm',
  MIST_BALM_TURNS: 'mist_balm_turns',

  // Gladiator skills
  FRENZY_TURNS: 'frenzy_turns',
  RAGE_BONUS: 'rage_bonus',
  IS_IGNORING_PAIN: 'is_ignoring_pain',
  FIGHT_COOLDOWN_DEATHBLOW: 'fight_cooldown_deathblow',

  // Lyca skills
  BEAR_FORM_COOLDOWN: 'bear_form_cooldown',
  LION_FORM_COOLDOWN: 'lion_form_cooldown',
  DRAGON_FORM_COOLDOWN: 'dragon_form_cooldown',

  // Tyrose Forest
  FOREST_DRAGON_TRACKS_COUNT: 'forest_dragon_tracks_count',
  FOREST_CAVE_DISCOVERED: 'forest_cave_discovered',

  // Tyrose Cave
  CAVE_DEAD_ENDS_COUNT: 'cave_dead_ends_count',
  GREEN_LAIR_DISCOVERED: 'green_lair_discovered',
  GREEN_DRAKE_ACID_LOOTED: 'green_drake_acid_looted',

  // Scatterslide
  QUARRY_BLOWN_UP: 'quarry_blown_up',
  MINE_ELEVATOR_FIXED: 'mine_elevator_fixed',
  UNDERDRIFT_DOOR_UNLOCKED: 'underdrift_door_unlocked',
  BROWN_DRAGON_TRACKING: 'brown_dragon_tracking',
  RUMBLING_TURNS: 'rumbling_turns',

  // Watermoon - Mystic
  _PORTAL_OPEN: '_portal_open',
  FAITH_PORTAL_OPEN: 'faith_portal_open',
  SHADOW_PORTAL_OPEN: 'shadow_portal_open',
  DEATH_PORTAL_OPEN: 'death_portal_open',
  _PLANE_LAYOUT: '_plane_layout',
  _LOCATION: '_location',
  _BOSS_LOCATION: '_boss_location',
  FAITH_BOSS_DEFEATED: 'faith_boss_defeated',
  SHADOW_BOSS_DEFEATED: 'shadow_boss_defeated',
  DEATH_BOSS_DEFEATED: 'death_boss_defeated',
  _DIRECTION: '_direction',
  CATACOMBS_OPEN: 'catacombs_open',
  NECRODRAGON_DEFEATS: 'necrodragon_defeats',
  NECRODRAGON_HEALTH: 'necrodragon_health',
  MYSTIC_BOSS: 'mystic_boss',

  // Watermoon - Scholar
  HALLWAY_CHOICES: 'hallway_choices',
  HALLWAY_REMAINING: 'hallway_remaining',
  HALLWAYS_COMPLETED: 'hallways_completed',
  SCHOLAR_BOSS: 'scholar_boss',

  // Watermoon - Rumble
  RUMBLE_BOSS: 'rumble_boss',
  HENCHMEN_DEFEATED: 'henchmen_defeated',
  NUM_FIGHTS: 'rumble_num_fights',

  // Watermoon - Postgame
  ASKED_BELTARA_AURETH: 'asked_beltara_aureth',
  ASKED_NICHOLAS_AURETH: 'asked_nicholas_aureth',
  ASKED_BARAD_AURETH: 'asked_barad_aureth',
  LYSTONE_CHIP_COUNT: 'lystone_chip_count',
  DIED_TO_LICH_QUEEN: 'died_to_lich_queen',
};

const PROFESSIONS = {
  // Tier 0
  NOVICE: 'novice',

  // Tier 1
  BARD: 'tier_1-bard',
  CARAVAN_GUARD: 'tier_1-caravan_guard',
  MERCENARY: 'tier_1-mercenary',

  // Tier 2:
  BATTLE_WITCH: 'tier_2-battle_witch',
  MIST_DANCER: 'tier_2-mist_dancer',
  GLADIATOR: 'tier_2-gladiator',
  LYCA: 'tier_2-lyca',
};

const LYCA_FORMS = {
  WOLF: 'wolf',
  BEAR: 'bear',
  LION: 'lion',
  DRAGON: 'dragon',
};

const PROPERTIES = {
  IS_ATTACK: 'is_attack',
  DOES_NOT_NEED_AMMO: 'does_not_need_ammo',
  HAS_SUB_ACTIONS: 'has_sub_actions',
  RANGED_ATTACK: 'ranged_attack',
  AOE_ATTACK: 'aoe_attack',
  BURN_ATTACK: 'burn_attack',
  CHILL_ATTACK: 'chill_attack',
  IS_GROUP: 'is_group',
  BONUS_CRIT_DAMAGE: 'bonus_crit_damage',
  DEFEND_CRIT_CHANCE: 'defend_crit_chance',
};

const STATS = {
  // Explore stats
  AP_SPENT: 'ap_spent',
  GOLD_LOOTED: 'gold_looted',
  FIGHTS_WON: 'fights_won',
  FIGHTS_LOST: 'fights_lost',
  FIGHTS_ESCAPED: 'fights_escaped',
  ENEMIES_KILLED: 'enemies_killed',
  REST_AP: 'rest_ap',
  REST_GOLD: 'rest_gold',
  REST_GOLD_SPENT: 'rest_gold_spent',

  // Money stats
  SCALES_PURCHASED: 'scales_purchased',
  MONEY_SPENT: 'money_spent',

  // Area intros
  SCATTERSLIDE_INTRO: 'scatterslide_intro',
  WATERMOON_INTRO: 'watermoon_intro',

  // Progression stats
  FLASK_PURCHASED: 'flask_purchased',
  EQUIPMENT_PURCHASED: 'equipment_purchased',
  EQUIPMENT_SOLD: 'equipment_sold',
  PROFESSION_MASTERY: 'profession_mastery',
  SCATTERSLIDE_BLACKSMITH_BUILT: 'scatterslide_blacksmith_built',
  SCATTERSLIDE_ARTIFICER_BUILT: 'scatterslide_artificer_built',
  EQUIPMENT_SLOT_INCREASES: 'equipment_slot_increases',
  REPUTATION_GAINED: 'reputation_gained',
  WATERMOON_REPUTATION: 'watermoon_reputation',
  WATERMOON_PORTAL_OPENED: 'watermoon_portal_opened',
  WATERMOON_ESSENCE_CRYSTALS_SPENT: 'watermoon_essence_crystals_spent',

  // Combat stats
  DAMAGE_DONE: 'damage_done',
  HIGHEST_DAMAGE_DONE: 'highest_damage_done',
  DAMAGE_RECEIVED: 'damage_received',
  HIGHEST_DAMAGE_RECEIVED: 'highest_damage_received',

  // Item stats
  ITEMS_CONSUMED: 'items_consumed',

  // Encounter stats
  CURSED_CHEST: 'encounter_cursed_chest',
  RESCUED_APPRENTICE: 'encounter_rescued_apprentice',
  BANDIT_CLEARING: 'encounter_bandit_clearing',
  CAVE_LOCKED_BOX: 'encounter_cave_locked_box',
  MONEY_MAKING_GAME: 'encounter_money_making_game',
  LOST_PURSE: 'encounter_lost_purse',
  GOBLIN_CHILD: 'encounter_goblin_child',
  LEAKY_CANTEEN: 'encounter_leaky_canteen',
  CREEPY_HOLE: 'encounter_creepy_hole',
  CASINO_GAMES_PLAYED: 'encounter_casino_games_played',
  PLANE_TUNNEL_TAKEN: 'encounter_plane_tunnel_taken',
  CRIER_MESSAGES_PURCHASED: 'crier_messages_purchased',
  GREETER_COMPLETED: 'greeter_completed',
};

const SINGLE_TURN_STATUSES = [
  FLAGS.DAMAGE_MODIFIER,
  FLAGS.CANNOT_CRIT,
  FLAGS.CANNOT_DODGE,
  FLAGS.IS_DEFENDING,
  FLAGS.IS_GUARDING,
  FLAGS.IS_CAUTIOUS,
  FLAGS.IS_TRIPPING,
  FLAGS.IS_IGNORING_QUARTER_ARMOUR,
  FLAGS.IS_IGNORING_HALF_ARMOUR,
  FLAGS.IS_MISDIRECTING,
  FLAGS.IS_DISCIPLINED,
  FLAGS.IS_FLURRYING,
  FLAGS.IS_IGNORING_PAIN,
];

const SPELL_SCHOOLS = {
  CONJURATION: 'conjuration',  // Conjuring something from nothing
  DIVINITY: 'divinity', // Spells that come from divinity, typically healing spells
  ENCHANTMENT: 'enchantment', // Enchant something to behave differently, typically better
  ILLUSION: 'illusion', // Illusion and trickery
  NATURE: 'nature', // Control of the natural world
  NECROMANCY: 'necromancy', // Control of the dead and undead
};

// # of seconds to delay after updating a message to display the results of that choice.
const STD_DELAY = 0.5;

const TIME = {
  DAY: 86400000,
  HOUR: 3600000,
  MINUTE: 60000,
  SECOND:  1000,
};

const ROUND_TIMED_STATUSES = [
  FLAGS.STUNNED_TURNS,
  FLAGS.STUN_COOLDOWN,
  FLAGS.TIRED_TURNS,
  FLAGS.POISONED_TURNS,
  FLAGS.DAZED_TURNS,
  FLAGS.GUARANTEED_HIT_TURNS,
  FLAGS.DISORIENTED_TURNS,
  FLAGS.FEEBLE_TURNS,
  FLAGS.POISON_CLOUD_TURNS,
  FLAGS.RUMBLING_TURNS,
  FLAGS.BURNED_TURNS,
  FLAGS.COLD_COMPRESS_TURNS,
  FLAGS.CHILLED_TURNS,
  FLAGS.HOT_CHOCOLATE_TURNS,
  FLAGS.INFLAMED_TURNS,
  FLAGS.RIPOSTE_COOLDOWN_TURNS,
  FLAGS.FRENZY_TURNS,
  FLAGS.ACID_TURNS,
  FLAGS.CURSED_TURNS,
  FLAGS.BLIND_TURNS,
  FLAGS.CONCUSSED_TURNS,
  FLAGS.ENRAGED_TURNS,
  FLAGS.WINDWALL_TURNS,
  `${FLAGS.SKILL_SLOT_DISABLED_TURNS}_0`,
  `${FLAGS.SKILL_SLOT_DISABLED_TURNS}_1`,
  `${FLAGS.SKILL_SLOT_DISABLED_TURNS}_2`,
  `${FLAGS.SKILL_SLOT_DISABLED_TURNS}_3`,
  `${FLAGS.SKILL_SLOT_DISABLED_TURNS}_4`,
];

const FIGHT_TIMED_STATUSES = [
  FLAGS.WELL_RESTED_TURNS,
  FLAGS.CHEST_CURSE_FRAILTY,
  FLAGS.CHEST_CURSE_CLUMSY,
  FLAGS.FIGHT_COOLDOWN_RALLY,
  FLAGS.FIGHT_COOLDOWN_SOOTHE,
  FLAGS.FIGHT_COOLDOWN_INSPIRE,
  FLAGS.FIGHT_COOLDOWN_MORE_LUTE,
  FLAGS.FIGHT_COOLDOWN_MIST_BALM,
  FLAGS.FIGHT_COOLDOWN_DEATHBLOW,
  FLAGS.AMBROSIA_FIGHT_USE,
  FLAGS.BEAR_FORM_COOLDOWN,
  FLAGS.LION_FORM_COOLDOWN,
  FLAGS.DRAGON_FORM_COOLDOWN,
];

module.exports = {
  AP_MINUTES,
  CHARACTER_STATE,
  COLORS,
  DIRECTIONS,
  REPUTATION_LEVELS,
  FIGHT_ACTIONS,
  FLAGS,
  SINGLE_TURN_STATUSES,
  SPELL_SCHOOLS,
  PROFESSIONS,
  LYCA_FORMS,
  PROPERTIES,
  STATS,
  STD_DELAY,
  TIME,
  ROUND_TIMED_STATUSES,
  FIGHT_TIMED_STATUSES,
  IMG_ROOT: 'https://s3.amazonaws.com/chatandslash/img/',
  TURNS_WELL_RESTED: 2,
  RECOVER_AP: 3,
  POTION_RESTORE_HP: 50,
  ELIXIR_RESTORE_MP: 50,
  STAMINA_INCREASE_FIGHT: 1,
  STAMINA_INCREASE_DEFEND: 3,
  TURNS_POISON_CLOUD: 4,
  ENEMY_XP_PER_LEVEL: 50,
  AOE_BONUS: 1.5,
  BURN_BONUS: 1.2,
  CHILL_REDUCTION: 10,
  HIDDEN_DAGGERS_CRIT_BONUS: 25,
  ACID_BLIND_CHANCE: 25,
  WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS: 50,
  WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS: 100,
  WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS: 150,
  WEAPON_DAMAGE_BONUS: 0.05,
  CURSED_CHEST_FRAILTY_PENALTY: 0.75,
  CURSED_CHEST_MISS_CHANCE: 50,
  WINDWALL_KNOCKBACK_CHANCE: 25,
  WINDWALL_TURNS: 5,
  WINDWALL_DAMAGE_MULTIPLIER: 0.25,
  LYSTONE_CHIP_MAX: 9,
  DEFAULT_BURNED_TURNS: 6,
  DEFAULT_CHILLED_TURNS: 6,
};