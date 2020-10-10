"use strict";

const mix                         = require('mixwith').mix;
const { WatermoonBonusBossEnemy } = require('@app/content/enemies/watermoon/bonus_boss');
const { WatermoonReputation }     = require('@mixins/enemy/reputation/watermoon');
const { FuriousAction }           = require('@mixins/enemy/actions/furious');
const { RecklessAttackAction }    = require('@mixins/enemy/actions/reckless_attack');
const { DropsMoondrop }           = require('@mixins/enemy/loot/moondrop');
const { between }                 = require('@util/random');
const { times }                   = require('lodash');
const { sprintf }                 = require("sprintf-js");
const { pluralize }               = require('@util/text');

const { FLAGS, PROPERTIES } = require('@constants');

const FLAG_CRANE_DEAD = 'crane_dead';
const FLAG_DRAGON_DEAD = 'dragon_dead';
const FLAG_ACTIVE_ENEMY = 'active_enemy';

const FLAG_CRANE_HP = 'crane_hp';
const FLAG_DRAGON_HP = 'dragon_hp';

const FLAG_SWOOP = 'swoop';
const SWOOP_MULTIPLIER = 4;

const FLAG_DAZE_COOLDOWN = 'daze_cooldown';

const DRAGON_FIRE_MULTIPLIER_NORMAL = 1;
const DRAGON_FIRE_MULTIPLIER_HYPER = 2;
const DRAGON_FIRE_TURNS = 6;

const DRAGON_CLAW_MULTIPLIER_NORMAL = 1.5;
const DRAGON_CLAW_MULTIPLIER_HYPER = 2.5;

const DRAGON_TAIL_LASH_TURNS_NORMAL = 1;
const DRAGON_TAIL_LASH_TURNS_HYPER = 2;

const ACTIVE_ENEMY_CRANE = 'crane';
const ACTIVE_ENEMY_DRAGON = 'dragon';

const CRANE_DODGE_STANDARD = 20;
const CRANE_DODGE_HYPER = 35;

const DRAGON_BOOST_STANDARD = 1.5;
const DRAGON_BOOST_HYPER = 3;

const DAZE_COOLDOWN = 6;

class TheCraneAndTheDragonEnemy extends mix(WatermoonBonusBossEnemy).with(
  FuriousAction(0),
  RecklessAttackAction(0),
  DropsMoondrop(100, 20),
  WatermoonReputation(150)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-crane_and_dragon',
      stats: {
        perLevel: {
          maxHp: 100,  // Reduced HP because comes back many times
        }
      },
    });

    this.districtBosses = [
      'watermoon-rumble-the_one',
      'watermoon-rumble-crane_and_dragon',
      'watermoon-rumble-the_ox',
    ];

    this.fightActionProperties.dragonSpitFire = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
      PROPERTIES.BURN_ATTACK,
    ];

    this.fightActionProperties.dragonBreatheFlame = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
      PROPERTIES.BURN_ATTACK,
    ];

    this.bossFlag = FLAGS.RUMBLE_BOSS;
  }

  /**
   * Get the display name of this enemy.
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getDisplayName(character) {
    return this.getActiveEnemy() === ACTIVE_ENEMY_CRANE ? "The Crane" : "The Dragon";
  }

  /**
   * What to display after "You encountered " when starting a fight.
   *
   * @param {Character} character - The character encountering the enemy.
   *
   * @return {string}
   */
  getEncounterName(character) {
    return 'The Crane and The Dragon';
  }

  /**
   * No determiner, is "The Crane" or "The Dragon".
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getDeterminer(character) {
    return "";
  }

  /**
   * Boost defence when Dragon is active, HYPER if Crane is dead.
   *
   * @return {integer}
   */
  get defence() {
    let boost = 1;
    if (this.getActiveEnemy() === ACTIVE_ENEMY_DRAGON) {
      boost = this.hasFlag(FLAG_CRANE_DEAD) ? DRAGON_BOOST_STANDARD : DRAGON_BOOST_HYPER;
    }

    return Math.ceil(this._defence * boost);
  }

  /**
   * Boost dodge when Crane is active, HYPER if Dragon is dead.
   *
   * @return {integer}
   */
  get dodge() {
    if (this.getActiveEnemy() === ACTIVE_ENEMY_CRANE) {
      return this.hasFlag(FLAG_DRAGON_DEAD) ? CRANE_DODGE_HYPER : CRANE_DODGE_STANDARD;
    }

    return this._dodge;
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
    if (this.hasFlag(FLAG_CRANE_DEAD)) {
      return "*The Dragon is enraged!*\nWith her partner dead, anger and magic has suffused her, and the glowing outline of an actual dragon appears around her.  She is stronger and more dangerous than before!";
    }
    else if (this.hasFlag(FLAG_DRAGON_DEAD)) {
      return "*The Crane is enraged!*\nWith his partner dead, anger and magic has suffused him, and the glowing outline of an actual crane appears around him.  He is faster and more dangerous than before!";
    }

    if (this.getActiveEnemy() === ACTIVE_ENEMY_CRANE) {
      return "Standing in front of his larger parter, this thin man balances easily on one leg and holds a short, sharp dagger in front of him, as if to simulate a short, sharp beak.  He doesn't appear *terribly* dangerous, except that he moves so terribly quickly and as a result is hard to hit.";
    }

    return "Standing in front of her more diminuitive partner, this tall, broad-shouldered, heavy and powerful woman wears green scale mail armour and wields a clawed gauntlet in one hand and long bo-staff in the other.  It takes a lot of guts to call yourself \"The Dragon\" when actual other dragons around could take issue with that claim, but this woman looks like she could handle enough attacks to back it up.";
  }

  /**
   * Get the currently-active boss you're fighting.
   *
   * @return {string}
   */
  getActiveEnemy() {
    return this.getFlag(FLAG_ACTIVE_ENEMY, ACTIVE_ENEMY_CRANE);
  }

  /**
   * Return the fight actions of this enemy as a weighted array for Random.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {array}
   */
  getWeightedFightActions(character) {
    if (this.hasFlag(FLAG_SWOOP)) {
      return [{ value: 'swoopDown', weight: 100 }];
    }

    // Crane active
    if (this.getActiveEnemy() === ACTIVE_ENEMY_CRANE) {

      // Dragon dead, HYPERPOWER
      if (this.hasFlag(FLAG_DRAGON_DEAD)) {
        let actions = [
          { value: 'getFurious', weight: 15 },
          { value: 'craneFlurry', weight: 20 },
          { value: 'recklessAttack', weight: 15 },
          { value: 'swoopUp', weight: 30 },
        ];

        if ( ! this.hasFlag(FLAG_DAZE_COOLDOWN)) {
          actions.push({ value: 'craneLargeWingBuffet', weight: 20 });
        }
        else {
          actions.push({ value: 'doAttack', weight: 20 });
        }

        return actions;
      }
      // Dragon alive, combo attacks
      else {
        let actions = [
          { value: 'getFurious', weight: 15 },
          { value: 'cranePeck', weight: 15 },
          { value: 'recklessAttack', weight: 15 },
          { value: 'craneCombo', weight: 35 },
        ];

        if ( ! this.hasFlag(FLAG_DAZE_COOLDOWN)) {
          actions.push({ value: 'craneSmallWingBuffet', weight: 20 });
        }
        else {
          actions.push({ value: 'doAttack', weight: 20 });
        }

        return actions;
      }
    }
    // Dragon active
    else {
      // Crane dead, HYPERPOWER
      if (this.hasFlag(FLAG_CRANE_DEAD)) {
        let actions = [
          { value: 'getFurious', weight: 15 },
          { value: 'dragonBreatheFlame', weight: 20 },
          { value: 'dragonMagicalClawsAttack', weight: 15 },
          { value: 'swoopUp', weight: 30 },
        ];

        if ( ! this.hasFlag(FLAGS.STUN_COOLDOWN)) {
          actions.push({ value: 'dragonMagicalTailLash', weight: 20 });
        }
        else {
          actions.push({ value: 'doAttack', weight: 20 });
        }

        return actions;
      }
      // Crane alive, combo attacks
      else {
        let actions = [
          { value: 'getFurious', weight: 15 },
          { value: 'dragonSpitFire', weight: 15 },
          { value: 'dragonClawAttack', weight: 15 },
          { value: 'dragonCombo', weight: 35 }
        ];

        if ( ! this.hasFlag(FLAGS.STUN_COOLDOWN)) {
          actions.push({ value: 'dragonStaffTailLash', weight: 20 });
        }
        else {
          actions.push({ value: 'doAttack', weight: 20 });
        }

        return actions;
      }
    }
  }

  /**
   * "Peck" the character with dagger, 1-3 times.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  cranePeck(character) {
    return this.craneMultiAttack(
      character,
      1,
      3,
      ":dagger_knife: The Crane \"pecks\" at you repeatedly with his knife!",
      ":frowning: %s attacks, dealing %s damage to you.%s",
    );
  }

  /**
   * Perform a flurry of attacks with dagger and "beak".
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  craneFlurry(character) {
    return this.craneMultiAttack(
      character,
      2,
      5,
      ":dagger_knife: The Crane delivers a flurry of attacks with his knife and his magical glowing beak.",
      ":frowning: %s attacks, dealing %s damage to you.%s",
    );
  }

  /**
   * Crane attacks multiple times.
   *
   * @param {Character} character - The character being attacked.
   * @param {integer} minAttacks - The minimum number of attacks to perform.
   * @param {integer} maxAttacks - The maximum number of attacks to perform.
   * @param {string} preText - The text to display before all the attacks.
   * @param {string} attackText - The text to display when an attack lands.
   *
   * @return {array}
   */
  craneMultiAttack(character, minAttacks, maxAttacks, preText, attackText) {
    let messages = [sprintf(preText, this.getDisplayName(character))];
    let attacks = between(minAttacks, maxAttacks);

    times(attacks, () => {
      messages = messages.concat(this.attackHelper(character, (attackInfo) => {
        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
        const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";

        character.decreaseHp(attackInfo.damage);

        return sprintf(attackText, this.getDisplayName(character), damageText, critText);
      }));
    });

    return messages;
  }

  /**
   * Attack with hand-chops like a wing buffet.
   *
   * @param {Character} character - The character being attacked.
   */
  craneSmallWingBuffet(character) {
    return this.craneDaze(
      character,
      1,
      4,
      ":dizzy_face: %s chops at you with his hands simulating the buffeting of wings, dealing %s damage %s dazing you for %d turns.%s",
      ":dash: %s chops at you with his hands, but you dodge!",
      "%s chops at you with his hands, but misses!",
    );
  }

  /**
   * Attack with actual magical wings to buffet the character.
   *
   * @param {Character} character - The character being attacked.
   */
  craneLargeWingBuffet(character) {
    return this.craneDaze(
      character,
      2,
      8,
      ":dizzy_face: %s buffets you with his magical crane wings, dealing %s damage %s dazing you for %d turns.%s",
      ":dash: %s attempts to buffet you with his magical crane wings, but you dodge!",
      "%s attempts to buffet you with his magical crane wings, but misses!",
    );
  }

  /**
   * Dazing the character with a Crane wing buffet.
   *
   * @param {Character} character - The character being attacked.
   * @param {float} multiplier - The damage multiplier for this attack.
   * @param {integer} duraction - The length of time the daze lasts for.
   * @param {string} attackText - The text to display for a successful attack.
   * @param {string} dodgeText - The text to display for a dodged attack.
   * @param {string} missText - The text to display for a missed attack.
   */
  craneDaze(character, multiplier, duration, attackText, dodgeText, missText) {
    return this.attackHelper(character, (attackInfo) => {
      character.setFlag(FLAGS.DAZED_TURNS, duration + 1);

      const damage = Math.ceil(attackInfo.damage * multiplier);
      const critText   = attackInfo.didCrit && damage > 0 ? " _Critical hit!_" : "";
      const damageText = damage > 0 ? `*${damage}*` : "no";
      const joinText = damage > 0 ? "and" : "but";
      character.decreaseHp(damage);
      this.setFlag(FLAG_DAZE_COOLDOWN, DAZE_COOLDOWN);

      return [sprintf(attackText, this.getDisplayName(character), damageText, joinText, duration, critText)];
    }, dodgeText, missText);
  }

  /**
   * Combo attack with Dragon, switching to Dragon.
   *
   * @param {Character} character - The character being combo'd.
   *
   * @return {array}
   */
  craneCombo(character) {
    return this.attackHelper(character, (attackInfo) => {

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";
      character.decreaseHp(attackInfo.damage);

      let messages = [`:right-facing_fist: The Crane attacks with blinding speed, doing ${damageText} damage and tagging in his partner, The Dragon!${critText}`];

      this.setFlag(FLAG_ACTIVE_ENEMY, ACTIVE_ENEMY_DRAGON);
      this.setFlag(FLAG_CRANE_HP, this.hp);
      this.hp = this.getFlag(FLAG_DRAGON_HP, this.maxHp);

      messages.push(this.attackHelper(character, (attackInfo) => {
        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
        const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";
        character.decreaseHp(attackInfo.damage);

        return `:left-facing_fist: The Dragon charges in from the tag and attacks, doing ${damageText} damage!${critText}`;
      }));

      return messages;
    });
  }

  /**
   * Fly high into the sky, preparing to do 4x damage next turn.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  swoopUp(character) {
    this.setFlag(FLAG_SWOOP);

    return [`${this.getDisplayName(character)} flies up high into the sky, preparing to dive down at you!`];
  }

  /**
   * Swoop down on the character, dealing 4x damage.
   *
   * @param {Character} character - The character getting swooped on.
   *
   * @return {array}
   */
  swoopDown(character) {
    this.clearFlag(FLAG_SWOOP);

    const dodgeText = ":dash: %s swoops down on you from up high, but you dodge!";
    const missText = "%s swoops down on you from up high, but misses!";

    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * SWOOP_MULTIPLIER);
      const critText   = attackInfo.didCrit && damage > 0 ? " _Critical hit!_" : "";
      const damageText = damage > 0 ? `*${damage}*` : "no";
      character.decreaseHp(damage);

      return [`${this.getDisplayName(character)} swoops down on you from up high, dealing ${damageText} damage!${critText}`];
    }, dodgeText, missText);
  }

  /**
   * Spit normal, fuel-from-the-mouth fire.
   *
   * @param {Character} character - The character having fire spit at them.
   */
  dragonSpitFire(character) {
    return this.dragonFireAttack(
      character,
      DRAGON_FIRE_MULTIPLIER_NORMAL,
      DRAGON_FIRE_TURNS,
      ":fire: %s takes a swig of high-proof alcohol and spits it at you while setting it aflame, dealing %s damage and burning you.%s",
      ":dash: %s takes a swig of high-proof alcohol and spits it at you but you dodge!",
      "%s takes a swig of high-proof alcohol and spits it at you but misses!",
    );
  }

  /**
   * Breathe magical flame.
   *
   * @param {Character} character - The character having fire spit at them.
   */
  dragonBreatheFlame(character) {
    return this.dragonFireAttack(
      character,
      DRAGON_FIRE_MULTIPLIER_HYPER,
      DRAGON_FIRE_TURNS,
      ":fire: %s takes a deep breath, then spews magical flame at you, dealing %s damage and burning you.%s",
      ":dash: %s takes a deep breath, then spews magical flame at you but you dodge!",
      "%s takes a deep breath, then spews magical flame at you but misses!",
    );
  }

  /**
   * Attack the character by breathing fire.
   *
   * @param {Character} character - The character being set on fire.
   * @param {float} multiplier - The damage multiplier for the attack.
   * @param {integer} turns - The number of turns to burn for.
   * @param {string} attackText - The text to display for a successful attack.
   * @param {string} dodgeText - The text to display when the attack is dodged.
   * @param {string} missText - The text to display when the attack misses.
   *
   * @return {array}
   */
  dragonFireAttack(character, multiplier, turns, attackText, dodgeText, missText) {
    const attackProperties = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
      PROPERTIES.BURN_ATTACK,
    ];

    return this.attackHelper(character, (attackInfo) => {
      let messages = [];

      attackInfo.damage = Math.ceil(attackInfo.damage * multiplier);

      character.decreaseHp(attackInfo.damage);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(__(attackText, this.getDisplayName(character), damageText, critText));

      messages = messages.concat(character.addStatusBurned(turns));

      return messages;
    }, dodgeText, missText, attackProperties);
  }

  /**
   * Attack the character by with clawed gauntlet.
   *
   * @param {Character} character - The character being set on fire.
   *
   * @return {array}
   */
  dragonClawAttack(character) {
    return this.attackHelper(character, (attackInfo) => {
      let messages = [];

      attackInfo.damage = Math.ceil(attackInfo.damage * DRAGON_CLAW_MULTIPLIER_NORMAL);

      character.decreaseHp(attackInfo.damage);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(`${this.getDisplayName(character)} swipes at you with her clawed gauntlet, dealing ${damageText} damage!${critText}`);

      return messages;
    });
  }

  /**
   * Attack the character by with magical claws.
   *
   * @param {Character} character - The character being set on fire.
   *
   * @return {array}
   */
  dragonMagicalClawsAttack(character) {
    return this.attackHelper(character, (attackInfo) => {
      let messages = [];

      attackInfo.damage = Math.ceil(attackInfo.damage * DRAGON_CLAW_MULTIPLIER_HYPER);

      character.decreaseHp(attackInfo.damage);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(`${this.getDisplayName(character)} swipes at you, glowing claws forming around her hands, dealing ${damageText} damage!${critText}`);

      return messages;
    });
  }

  /**
   * Sweep bo staff like a tail and knock character over.
   *
   * @param {Character} character - The character being lashed.
   *
   * @return {array}
   */
  dragonStaffTailLash(character) {
    return this.dragonStunAttack(
      character,
      DRAGON_TAIL_LASH_TURNS_NORMAL,
      "%s drags her staff behind her like a tail and lashes you with it, dealing %s damage and stunning you for %d turns!%s",
      ":dash: %s drags her staff behind her like a tail and lashes at you, but you dodge!",
      "%s drags her staff behind her like a tail and lashes at you, but misses!",
    );
  }

  /**
   * Magical tail lash, longer knock over.
   *
   * @param {Character} character - The character being lashed.
   *
   * @return {array}
   */
  dragonMagicalTailLash(character) {
    return this.dragonStunAttack(
      character,
      DRAGON_TAIL_LASH_TURNS_HYPER,
      "%s lashes you with a her glowing, magical tail, dealing %s damage and stunning you for %d turns!%s",
      ":dash: %s lashes at you with a her glowing, magical tail, but you dodge!",
      "%s lashes at you with a her glowing, magical tail, but misses!",
    );
  }

  /**
   * Attack the character and stun them.
   *
   * @param {Character} character - The character being stunned.
   * @param {integer} turns - The number of turns to stun for.
   * @param {string} attackText - The text to display for a successful attack.
   * @param {string} dodgeText - The text to display when the attack is dodged.
   * @param {string} missText - The text to display when the attack misses.
   *
   * @return {array}
   */
  dragonStunAttack(character, turns, attackText, dodgeText, missText) {
    return this.attackHelper(character, (attackInfo) => {
      let messages = [];

      character.setFlag(FLAGS.STUNNED_TURNS, turns + 1);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(__(attackText, this.getDisplayName(character), damageText, turns, critText));
      this.setFlag(FLAGS.STUN_COOLDOWN, turns + 2);

      character.decreaseHp(attackInfo.damage);

      return messages;
    }, dodgeText, missText);
  }

  /**
   * Combo attack with Crane, switching to Crane.
   *
   * @param {Character} character - The character being combo'd.
   *
   * @return {array}
   */
  dragonCombo(character) {
    return this.attackHelper(character, (attackInfo) => {

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";
      character.decreaseHp(attackInfo.damage);

      let messages = [`:right-facing_fist: The Dragon pummels you, doing ${damageText} damage and tagging in her partner, The Crane!${critText}`];

      this.setFlag(FLAG_ACTIVE_ENEMY, ACTIVE_ENEMY_CRANE);
      this.setFlag(FLAG_DRAGON_HP, this.hp);
      this.hp = this.getFlag(FLAG_CRANE_HP, this.maxHp);

      messages.push(this.attackHelper(character, (attackInfo) => {
        const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? " _Critical hit!_" : "";
        const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";
        character.decreaseHp(attackInfo.damage);

        return `:left-facing_fist: The Crane leaps in from the tag and attacks, doing ${damageText} damage!${critText}`;
      }));

      return messages;
    });
  }

  /**
   * Every three rounds, swap to another section.
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(opponent) {
    let messages = super.doPostRoundActions(opponent);

    if (this.hp <= 0) {
      // If Crane dies, switch to Dragon (if possible)
      if (this.getActiveEnemy() === ACTIVE_ENEMY_CRANE && ! this.hasFlag(FLAG_DRAGON_DEAD)) {
        this.setFlag(FLAG_CRANE_DEAD);
        this.setFlag(FLAG_ACTIVE_ENEMY, ACTIVE_ENEMY_DRAGON);
        this.hp = this.maxHp;

        messages.push(":high_brightness::rage::high_brightness: As you strike down The Crane, The Dragon howls in anger!  A powerful glow surrounds her in the shape of a dragon, and she rounds on you, desperate to avenge her fallen friend.");
      }
      // If Dragon dies, switch to Crane (if possible)
      else if (this.getActiveEnemy() === ACTIVE_ENEMY_DRAGON && ! this.hasFlag(FLAG_CRANE_DEAD)) {
        this.setFlag(FLAG_DRAGON_DEAD);
        this.setFlag(FLAG_ACTIVE_ENEMY, ACTIVE_ENEMY_CRANE);
        this.hp = this.maxHp;

        messages.push(":high_brightness::rage::high_brightness: As you strike down The Dragon, The Crane howls in anger!  A powerful glow surrounds him in the shape of a crane, and he rounds on you, desperate to avenge his fallen friend.");
      }
    }
    else {
      // Character is dazed?
      if (opponent.hasFlag(FLAGS.DAZED_TURNS)) {
        const turns = opponent.getFlag(FLAGS.DAZED_TURNS) - 1;
        const turnText = (turns > 0) ? ` for ${turns} more ${pluralize("turn", turns)} turns` : "";
        messages.push(`:dizzy_face: You stumble a bit, dazed from your ${this.getDisplayName(opponent)}'s attack${turnText}.  Your defence is 25% lower, and you cannot defend!`);
      }

      if (this.hasFlag(FLAG_DAZE_COOLDOWN)) {
        this.decrementFlag(FLAG_DAZE_COOLDOWN);
      }
    }

    return messages;
  }

  /**
   * Only dead if both are dead.
   *
   * @return boolean
   */
  isDead() {
    if (super.isDead()) {
      // If Crane is dying, only dead if Dragon is also dead
      if (this.getActiveEnemy() === ACTIVE_ENEMY_CRANE) {
        return this.hasFlag(FLAG_DRAGON_DEAD);
      }
      // If Dragon is dying, only dead if Crane is also dead
      else {
        return this.hasFlag(FLAG_CRANE_DEAD);
      }
    }

    return false;
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
    character.clearFlag(FLAGS.NUM_FIGHTS);
    character.clearFlag(FLAGS.HENCHMEN_DEFEATED);

    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-shadow_lesser');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-drunken_master');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-jackie_mann');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-shadow_greater');

    return super.doFightSuccess(character, messages);
  }
}

module.exports = TheCraneAndTheDragonEnemy;