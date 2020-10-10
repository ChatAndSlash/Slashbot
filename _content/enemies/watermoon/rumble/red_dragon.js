"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;
const Random              = require('@util/random');

const FLAGS = require('@constants').FLAGS;

const FLAG_PHASE_2_SAID = 'phase_2_said';
const FLAG_PHASE_3_SAID = 'phase_3_said';

const BreatheFlame = BurnAction(0, {
  isRanged: true,
  dodgeText: ":dash: %s breathes deep red flame, but you dodge!",
  missText: "%s breathes deep red flame, but misses!",
  attackText: ":fire: %s breathes deep red flame at you, dealing %s damage and burning you.%s"
});

const TailWhip = DazeAction(0, {
  dodgeText: ":dash: %s whips her tail at you, but you dodge!",
  missText: "%s whips her tail at you, but misses!",
  attackText: ":dizzy_face: %s whips her tail at you and hits you squarely in the head, dealing %s damage %s dazing you for %d turns.%s"
});

class RedDragonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  BreatheFlame,
  TailWhip,
  DropsMoondrop(100, 6),
  WatermoonReputation(150)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-red_dragon',
      displayName: __("Red Dragon"),
      description: __("Most dragons you've seen so far are pretty reasonably proportional, but this one can only be described as top-heavy, with massive muscles in her forelimbs and shoulders.  She's definitely been working out, but it looks like she's been skipping leg day."),
      isBoss: true,
      scales: 8,
      stats: {
        base: {
          maxHp: 75,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 75,
          goldMin: 20,
          goldMax: 25
        }
      },
    });
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
    let description = __(this._description);

    if (this.hp >= this.maxHp * 0.75) {
      description += __("\nShe's clearly displeased with you, and doesn't consider you worth her time.");
    }
    else if (this.hp >= this.maxHp * 0.33) {
      description += __("\nShe's definitely irate now, and starting to take you seriously.");
    }
    else {
      description += __("\nShe's furious with you and trying to smash you into paste.");
    }

    if (this.hasFlag(FLAGS.IS_RANGED)) {
      description += __("\n\n%s %s not in melee range.", this.getDisplayName(character), this.isAre);
    }

    return description;
  }

  /**
   * Get the fight actions for this enemy.
   *
   * @param {Character} character - The character this enemy is fighting.
   * @param {object} actions - Actions passed in from mixed-in actions.
   *
   * @return {object}
   */
  getFightActions(character, actions = {}) {
    actions = {
      getFurious: 20,
      doAttack: 40,
      burn: 20,
      daze: 10,
    };

    if (this.hp >= this.hp * 0.75) {
      actions.flick = 10;
    }
    else if (this.hp >= this.hp * 0.33) {
      actions.smack = 10;
    }
    else {
      actions.pound = 10;
    }

    return actions;
  }

  /**
   * Flicks the character with her claws for 1.5x damage.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  flick(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 1.5);
      const critText   = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("%s flicks you with her claws for %s damage, scoffing at you.%s", this.getDisplayName(character), attackText, critText)];
    });
  }

  /**
   * Smacks the character with a backhand for 2.5x damage.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  smack(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 2.5);
      const critText   = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("%s smacks you backhanded for %s damage!%s", this.getDisplayName(character), attackText, critText)];
    });
  }

  /**
   * Pounds the character with her fist for 4x damage.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  pound(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 4);
      const critText   = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("%s pounds you in a rage for %s damage!%s", this.getDisplayName(character), attackText, critText)];
    });
  }

  /**
   * Perform any actions that happen after the round (decrement/clear all timers, etc)
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(opponent) {
    let messages = super.doPostRoundActions(opponent);

    if (this.hp <= this.maxHp * 0.75 && ! this.hasFlag(FLAG_PHASE_2_SAID)) {
      messages.push(__("*She snorts, a tiny bit of flame coming from her nostrils.  \"Okay, fine.  Maybe you've got some chops.  But you still can't hold a candle to these guns!\"  She flexes her forelimbs impressively.*"));
      this.setFlag(FLAG_PHASE_2_SAID);
    }
    else if (this.hp <= this.maxHp * 0.33 && ! this.hasFlag(FLAG_PHASE_3_SAID)) {
      messages.push(__("*\"You're pathetic!\" she screams. \"Pathetic!  I'll squish you like a bug!\"*"));
      this.setFlag(FLAG_PHASE_3_SAID);
    }

    return messages;
  }

  /**
   * Set a flag indicating this boss has been defeated.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    // Gotta define this in here to avoid circular content file references
    const Locations = require('@app/content/locations').Locations;
    character.location = Locations.new('watermoon-gilded-exchange');

    character.clearFlag(FLAGS.NUM_FIGHTS);
    character.clearFlag(FLAGS.HENCHMEN_DEFEATED);

    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-shadow_lesser');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-drunken_master');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-jackie_mann');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-rumble-shadow_greater');

    character.setFlag(FLAGS.IN_CUTSCENE);
    character.setFlag(FLAGS.RUMBLE_BOSS, Random.fromArray([
      'watermoon-rumble-the_ox',
      'watermoon-rumble-the_one',
      'watermoon-rumble-crane_and_dragon',
    ]));

    character.track('Red Dragon Killed');

    messages = messages.concat([
      __("You deliver the final blow to the Red Dragon, and she collapses to the ground.  \"Dang,\" she says.  \"Ya got me.\""),
      __("You extend a hand towards the Red Dragon and envelop her with Phaera's flame.  As it consumes her, she looks to you, pleading.  \"I was... really buff though... Right?\""),
      __("You nod, and she smiles, and disappears.  You head back to town, not knowing quite how you feel.  When you tell Aureth of your deed, she smiles sadly."),
      { npc: 'aureth', text: __('"I think I\'ll miss Joanie.  That was her name, you know.  She was a better person before she got obsessed about working out, but well, getting obsessed is what we Dragons do, right?"') },
      { npc: 'aureth', text: __('"Look, you\'ve only got two dragons left to kill, and then this town is mine, I mean *ours*, right?"') },
      __("She coughs, clearly hoping you didn't notice her little faux-pas."),
      { npc: 'aureth', text: __('"Anyway, while you were out, a caravan came by and resupplied our local merchants.  You should check and see if they have anything useful.  Then, head on over to the Scholar District and let\'s get this finished."') },
      __("You nod again and take your leave, wondering just what's going through Aureth's head right now."),
    ]);

    character.slashbot.tellStory(messages, character);

    return [];
  }
}

module.exports = RedDragonEnemy;