"use strict";

const { mix }                     = require('mixwith');
const { times }                   = require('lodash');
const { WatermoonBonusBossEnemy } = require('@app/content/enemies/watermoon/bonus_boss');
const Gun                         = require('@app/content/items/equipment/weapons/guns');
const { WatermoonReputation }     = require('@mixins/enemy/reputation/watermoon');
const { FuriousAction }           = require('@mixins/enemy/actions/furious');
const { DropsMoondrop }           = require('@mixins/enemy/loot/moondrop');
const { fromArray }               = require('@util/random');

const { FLAGS } = require('@constants');

const FLAG_NUM_ATTACKS = 'num_attacks';
const FLAG_ATTACK_MULTIPLIER = 'attack_multiplier';

const MAX_NUM_ATTACKS = 5;
const MODIFIED_MAX_HP = 7500;

const MARTIAL_ARTS = [
  'kung fu',
  'karate',
  'jiu jitsu',
  'istunka',
  'dambe',
  'engolo',
  'capoeira',
  'defendo',
  'juego de mani',
  'kenpo',
  'boxing',
  'olympic wrestling',
  'jeet kune do',
  'gun kata',
  'to-shin do',
  'tai chi',
  'wing chun',
  'krav maga',
  'aikido',
  'ninjutsu',
  'pad se ew',
  'muay thai',
  'sambo',
  'kick boxing',
];

class TheOneEnemy extends mix(WatermoonBonusBossEnemy).with(
  FuriousAction(0),
  DropsMoondrop(100, 20),
  WatermoonReputation(150)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-the_one',
      displayName: "The One",
      description: "A tall man in a long dark coat stands confidently before you.  He takes up a fighting stance and addresses you: \"I'm going to show these people what you don't want them to see. I'm going to show them a world without you.\"",
    });

    this.districtBosses = [
      'watermoon-rumble-the_one',
      'watermoon-rumble-crane_and_dragon',
      'watermoon-rumble-the_ox',
    ];

    this.bossFlag = FLAGS.RUMBLE_BOSS;
  }

  /**
   * No determiner, is just "The One".
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getDeterminer(character) {
    return "";
  }

  /**
   * What to display after "You encountered " when starting a fight.
   *
   * @param {Character} character - The character encountering the enemy.
   *
   * @return {string}
   */
  getEncounterName(character) {
    return this.getLevelName(character);
  }

  /**
   * Override max HP.
   *
   * @param {integer} level - The level to set them to.
   * @param {integer} levelBonus - A location-based level bonus to add/subtract.
   */
  setLevel(level, levelBonus = 0) {
    super.setLevel(level, levelBonus);

    this.maxHp = MODIFIED_MAX_HP;
    this._hp = MODIFIED_MAX_HP;
  }

  /**
   * Get the modified offence of this enemy.
   *
   * @return {integer}
   */
  getOffence() {
    const offence = super.getOffence();
    const multiplier = this.getFlag(FLAG_ATTACK_MULTIPLIER, 1);

    return offence * multiplier / 2;
  }

  /**
   * Return the fight actions of this enemy as a weighted array for Random.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {array}
   */
  getWeightedFightActions(character) {
    return [
      { value: 'getFurious', weight: 10 },
      { value: 'martialArts', weight: 90 },
    ];
  }

  /**
   * If character is using a gun, dodge all bullets.
   *
   * @param {Character} character - The character in the fight.
   * @param {array} messages - Messages to add to.
   *
   * @return {array}
   */
  doFightTurnStart(character, messages) {
    // Is character using a gun?  Too bad, The One can dodge bullets
    if (character.weapon instanceof Gun) {
      this.dodge = 100;
    }

    return messages;
  }

  /**
   * Every time slime "dies", come back as a new slime.
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(opponent) {
    let messages = super.doPostRoundActions(opponent);

    // If battle is still ongoing, The One gets stronger.
    if ( ! (this.isDead() || opponent.isDead())) {
      let numAttacks = this.getFlag(FLAG_NUM_ATTACKS, 1);

      // Max number of attacks? Reset num attacks, increase attack multiplier.
      if (MAX_NUM_ATTACKS === numAttacks) {
        this.setFlag(FLAG_NUM_ATTACKS, 1);
        this.incrementFlag(FLAG_ATTACK_MULTIPLIER, 1, 1);

        messages.push(`:dark_sunglasses: ${this.getDisplayName(opponent)}'s eyes close as a sharp glow pulses out from him, then fades.  Suddenly, his eyes snap open and he looks directly at you.  "I know ${fromArray(MARTIAL_ARTS)}."`);
      }
      // Increase num attacks
      else {
        this.incrementFlag(FLAG_NUM_ATTACKS, 1, 1);

        messages.push(`${this.getDisplayName(opponent)} begins to move a little faster.`);
      }

      // Is character using a gun?  Too bad, The One can dodge bullets
      if (opponent.weapon instanceof Gun) {
        messages.push(`${this.getDisplayName(opponent)} looks around him as if he could see the trails of the bullets he just dodged.  "Whoah."`);
      }
    }

    return messages;
  }

  /**
   * The One uses their accumulated knowledge and does some cool martial arts.
   *
   * @param {Character} character - The character being martial art-ed.
   *
   * @return {array}
   */
  martialArts(character) {
    let messages = [];
    let numAttacks = this.getFlag(FLAG_NUM_ATTACKS, 1);

    times(numAttacks, () => {
      messages = messages.concat(this.attackHelper(character, (attackInfo) => {
        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
        const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";

        character.decreaseHp(attackInfo.damage);

        return `:frowning: ${this.getDisplayName(character)} attacks, dealing ${damageText} damage to you.${critText}`;
      }));
    });

    return messages;
  }

  /**
   * Clear all Rumble flags.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    messages = messages.concat(["The One looks up at you as he collapses.  \"How did you beat me?  ...You're too fast.\""]);

    character.clearFlag(FLAGS.NUM_FIGHTS);
    character.clearFlag(FLAGS.HENCHMEN_DEFEATED);

    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-shadow_lesser');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-drunken_master');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-jackie_mann');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-shadow_greater');

    return super.doFightSuccess(character, messages);
  }
}

module.exports = TheOneEnemy;