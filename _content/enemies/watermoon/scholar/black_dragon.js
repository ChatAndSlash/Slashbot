"use strict";

const mix                 = require('mixwith').mix;
const Actions             = require('slacksimple').Actions;
const Combat              = require('@app/combat');
const Text                = require('@util/text');
const Random              = require('@util/random');
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS         = require('@constants').FLAGS;
const FIGHT_ACTIONS = require('@constants').FIGHT_ACTIONS;
const PROPERTIES    = require('@constants').PROPERTIES;

const FLAG_MYSTERY_TURNS = 'mystery_turns';
const FLAG_NUM_ANSWERS = 'num_answers';
const FLAG_CHOSEN_RIDDLE = 'chosen_riddle';

const ITEM_CLUE = 'quest-watermoon-clue';
const FIGHT_ACTION_USE_CLUE = 'use_clue';
const FIGHT_ACTION_SOLVE_RIDDLE = 'riddle';

const DIFFICULTY_EASY = 'easy';
const DIFFICULTY_HARD = 'hard';
const DIFFICULTY_IMPOSSIBLE = 'impossible';

const CurseAttack = CurseAction(10, { duration: 10 });

const BreatheFireAttack = BurnAction(20, {
  dodgeText: ":dash: %s breathes black flame but you dodge!",
  missText: "%s breathes black flame but she misses!",
  attackText: ":fire: %s breathes black flame, dealing %s damage and burning you.%s"
});

const BlindAttack = BlindAction(10, {
  blindText: ":astonished: %s coughs up noxious fumes that sting your eyes, dealing %s damage %s blinding you for %d turns.%s",
});

const ConcussAttack = ConcussAction(0, {
  text: "%s smashes you with her tail, dealing %s damage and concussing you!%s"
});

const StunAttack = StunAction(0, {
  dodgeText: ":dash: %s smashes at you with her tail, but you dodge away!",
  missText: "%s smashes at you with her tail, but misses you completely.",
  attackText: ":tired_face: %s smashes you with her tail, dealing %s damage and stunning you for %d turns!%s"
});

class BlackDragonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  CurseAttack,
  BreatheFireAttack,
  BlindAttack,
  ConcussAttack,
  StunAttack,
  DropsMoondrop(100, 6),
  WatermoonReputation(1)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-black_dragon',
      displayName: "Black Dragon",
      description: "Smaller than the other dragons you've seen, her black scales and quick speed allow her to hide and strike from the shadows.  She keeps her wings folded behind her to further reduce her profile.",
      isBoss: true,
      scales: 8,
      stats: {
        base: {
          maxHp: 75,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 60,
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
    let description = super.getDescription(character);

    const riddleIndex = this.getFlag(FLAG_CHOSEN_RIDDLE, false);
    if (false !== riddleIndex) {
      const difficulty = this.getDifficulty();
      const riddle = this.getRiddles(character, difficulty)[riddleIndex];

      description += __("\n\nThe Black Dragon has posed you the following riddle:\n\n\"%s\"", riddle.question);
    }
    else if (this.hasFlag(FLAG_MYSTERY_TURNS)) {
      description += __("\n\nThe Black Dragon is shrouded in Mystery.");
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
    // If cloaked in mystery, use fancy new attacks
    if (this.hasFlag(FLAG_MYSTERY_TURNS)) {
      return {
        mysterySmash: 40,
        mysterySlice: 40,
        mysteryFlame: 20
      };
    }

    // Change concuss to stun to attacks below 33%
    if (this.hp < this.maxHp * 0.33) {
      return {
        getFurious: 20,
        mysteryAttack: 10,
        burn: 20,
        blind: 10,
        doStun: 20,
        doAttack: 20,
      };
    }

    // Add concuss to attacks below 66%
    if (this.hp < this.maxHp * 0.66) {
      return {
        getFurious: 20,
        mysteryAttack: 10,
        burn: 20,
        blind: 10,
        concuss: 20,
        doAttack: 20,
      };
    }

    actions.mysteryAttack = 10;

    return super.getFightActions(character, actions);
  }

  /**
   * If low enough to ask a riddle, ask that riddle instead of combat actions!
   *
   * @param {string} fightAction - The action to perform.
   * @param {Character} character - The character being attacked.
   *
   * @return {array} Messages generated.
   */
  doFightAction(fightAction, character) {
    // Riddles are the highest priority action
    if (this.shouldAskRiddle()) {
      return super.doFightAction('askRiddle', character);
    }

    return super.doFightAction(fightAction, character);
  }

  /**
   * Ask a riddle at 66%, 33%, and 0 health.
   *
   * @return boolean
   */
  shouldAskRiddle() {
    // If a riddle has already been chosen, this turn contains the response to the answer
    // Don't ask another riddle!
    if ( ! this.hasFlag(FLAG_CHOSEN_RIDDLE)) {
      // Must answer final riddle to defeat dragon
      if (this.hp <= 0 && this.getFlag(FLAG_NUM_ANSWERS, 0) < 3) {
        return true;
      }

      // Must answer a second riddle to get lower than 33%
      if (this.hp < this.maxHp * 0.33 && this.getFlag(FLAG_NUM_ANSWERS, 0) < 2) {
        return true;
      }

      // Must answer first riddle to get lower than 66%
      if (this.hp < this.maxHp * 0.66 && this.getFlag(FLAG_NUM_ANSWERS, 0) < 1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Ask the character a riddle, increasing in difficulty the lower the HP the dragon is.
   *
   * @param {Character} character - The character being asked the riddle.
   *
   * @return {array}
   */
  askRiddle(character) {
    const difficulty = this.getDifficulty();
    const riddleIndex = this.getRiddleIndex(character, difficulty);
    const riddle = this.getRiddles(character, difficulty)[riddleIndex];

    this.setFlag(FLAG_CHOSEN_RIDDLE, riddleIndex);

    return __("\nThe Black Dragon draws back, panting heavily.\n\n\"Wait!\" she cries.\"  Before I will allow this fight to go any further, you must answer me this riddle:\n\n\"%s\"\n", riddle.question);
  }

  /**
   * Get the difficulty of the riddle to ask.
   *
   * @return {string}
   */
  getDifficulty() {
    if (this.hp <= 0) {
      return DIFFICULTY_IMPOSSIBLE;
    }
    else if (this.hp < this.maxHp * 0.33) {
      return DIFFICULTY_HARD;
    }
    else if (this.hp < this.maxHp * 0.66) {
      return DIFFICULTY_EASY;
    }
  }

  /**
   * Get the index of the currently chosen riddle, or randomly choose one.
   *
   * @param {Character} character - The character to choose the riddle for.
   * @param {string} difficulty - The difficulty to get the riddle for.
   *
   * @return {index}
   */
  getRiddleIndex(character, difficulty) {
    const riddleIndex = this.getFlag(FLAG_CHOSEN_RIDDLE, false);
    return false === riddleIndex
      ? this.chooseRiddle(character, difficulty)
      : riddleIndex;
  }

  /**
   * Picks a random riddle for a specific difficulty.
   *
   * @param {Character} character - The character to get a random riddle for.
   * @param {string} difficulty - The difficulty of the riddle to get.
   *
   * @return {integer} The index of the chosen riddle.
   */
  chooseRiddle(character, difficulty) {
    return Random.between(0, this.getRiddles(character, difficulty).length - 1);
  }

  /**
   * Get all riddles for a specific difficulty.
   *
   * @type {string} difficulty - The difficulty of the riddles to get.
   *
   * @return {string}
   */
  getRiddles(character, difficulty) {
    if (DIFFICULTY_EASY === difficulty) {
      return [{
        question: __("What letter of the alphabet has the most water in it?"),
        answers: [
          __("W"),
          __("C"),
          __("R"),
        ],
        correct: 1,
        response: __("Hmn, yes, the \"sea\".  Perhaps that one was too easy.")
      }, {
        question: __("Willard is 4, and his little brother Nedrick is half his age.  What age will Nedrick be when Willard is 100?"),
        answers: [
          __("50"),
          __("44"),
          __("98"),
        ],
        correct: 2,
        response: __("Of course, he's not *always* half his age, just two years younger.  Obviously you saw that...")
      }, {
        question: __("You can see me in water, but I never get wet.  What am I?"),
        answers: [
          __("A fish"),
          __("A reflection"),
          __("A stone"),
        ],
        correct: 1,
        response: __("Though if *you're* already wet, then your reflection would be wet too.  Going to have to workshop that one...")
      }, {
        question: __("The more you take, the more you leave behind. What am I?"),
        answers: [
          __("Footsteps"),
          __("Time"),
          __("Fruitcake"),
        ],
        correct: 0,
        response: __("Though, fruitcake does seem to multiply somehow...")
      }, {
        question: __("What gets bigger the more you take from it?"),
        answers: [
          __("A pile"),
          __("A hole"),
          __("A whole pile"),
        ],
        correct: 1,
        response: __("Not a particularly deep question.  Ahem.  Yes.")
      }];
    }
    else if (DIFFICULTY_HARD === difficulty) {
      return [{
        question: __("Everyone has me, but nobody can lose me.  What am I?"),
        answers: [
          __("Weight"),
          __("Patience"),
          __("A shadow"),
        ],
        correct: 2,
        response: __("Hm.  Yes.  Though losing weight can be tricky...")
      }, {
        question: __("If you give birth to an orphan, what are you?"),
        answers: [
          __("The father"),
          __("The mother"),
          __("Dead"),
        ],
        correct: 2,
        response: __("I mean, you could make a case for the other two, but one answer is clearly more correct than the others, and I guess you figured it out.")
      }, {
        question: __("Half of five is 2.  What is one-third of ten?"),
        answers: [
          __("5"),
          __("1"),
          __("2"),
        ],
        correct: 1,
        response: __("Hah!  Yes!  The count of letters!  Wait, uh, dang.  I didn't... want you to guess correctly...  Hm.")
      }, {
        question: __("A murderer is condemned to death.  He must choose between being burned alive, hanged from a gallows, or fed to lions that haven't eaten in three years.  What method of execution should he choose?"),
        answers: [
          __("Fire"),
          __("Hanging"),
          __("Lions"),
        ],
        correct: 2,
        response: __("I mean, I'd choose fire, since it hardly tickles, but yes, lions that haven't eaten for three years would be quite dead.")
      }, {
        question: __("Calis is a picky eater.  She likes grapes, but hates potatoes.  She loves squash, but can't stand lettuce.  And she thinks peas are divine, but thinks onions are disgusting.  Will she prefer pumpkins, apples, or carrots?"),
        answers: [
          __("Pumpkins"),
          __("Apples"),
          __("Carrots"),
        ],
        correct: 0,
        response: __("I wonder if it was a mistake to put the clue in the question like that?")
      }];
    }
    else if (DIFFICULTY_IMPOSSIBLE === difficulty) {
      return [{
        question: __("If I take thirty-seven carrots, fifty-eight tomatoes, and twenty-nine apples, and put them in a bushel, and count up all the vegetables, then divide that by all the fruit, *then* grab half as many wooden swords and give them out to knights in training, then I send those knights against half again as many thieves, but the thieves have been training for two and three-quarters as long as the knights have been, and they're aided by twelve different..."),
        answers: [
          __("Just attack her"),
        ],
        correct: 0,
        response: "Hey how dare!"
      }];
    }

    throw new Error(`"Invalid difficulty: '${difficulty}'."`);
  }

  /**
   * Can't die until the final riddle is "solved".
   *
   * @return boolean
   */
  isDead() {
    return this.hasFlag(FLAG_NUM_ANSWERS, 3);
  }

  /**
   * Wraps herself in mystery for 5 turns, doing stronger attacks.  Can reveal by using clues.
   *
   * @param {Character} character - The character to attack.
   *
   * @return {array}
   */
  mysteryAttack(character) {
    this.setFlag(FLAG_MYSTERY_TURNS, 6);

    return [__(":crystal_ball: The Black Dragon wraps herself in mystery, disappearing from your view and disorienting you!")];
  }

  /**
   * If Black Dragon is wrapped in mystery, character can only Do Nothing or use clues.
   *
   * @param {Character} character - The character to modify the action buttons for.
   * @param {Actions} actions - The action buttons to modify.
   *
   * @return {Actions}
   */
  modifyActions(character, actions) {
    if (this.hasFlag(FLAG_MYSTERY_TURNS)) {
      actions = new Actions();

      actions.addAction(Combat.getDoNothingButton(character));
      actions.addAction(this.getUseClueAction(character));
    }
    else {
      const chosenRiddle = this.getFlag(FLAG_CHOSEN_RIDDLE, false);
      if (chosenRiddle !== false) {
        actions = new Actions();

        const difficulty = this.getDifficulty();
        const riddleIndex = this.getRiddleIndex(character, difficulty);
        const riddle = this.getRiddles(character, difficulty)[riddleIndex];

        for (let index in riddle.answers) {
          actions.addAction(this.getSolveRiddleAction(riddle.answers[index], index));
        }
      }
    }

    return actions;
  }

  /**
   * No skills are usable when the dragon is wrapped in mystery or asking a riddle.
   *
   * @param {Character} character - The character to modify the skill action buttons for.
   * @param {Actions} actions - The skill action buttons to modify.
   *
   * @return {Actions}
   */
  modifySkillActions(character, actions) {
    const chosenRiddle = this.getFlag(FLAG_CHOSEN_RIDDLE, false);
    if (this.hasFlag(FLAG_MYSTERY_TURNS) || chosenRiddle !== false) {
      return new Actions();
    }

    return actions;
  }

  /**
   * Use clues to dispell mystery.
   *
   * @param {Character} character - The character performing the action.
   * @param {string} type - The type of action being performed.
   * @param {object} info - All info about the action selected.
   *
   * @return {array}
   */
  doCharacterFightAction(character, type, info) {
    if (FIGHT_ACTION_USE_CLUE === type) {
      const usedClues = this.getCluesRequired();

      character.inventory.remove(ITEM_CLUE, usedClues);
      this.clearFlag(FLAG_MYSTERY_TURNS);

      return [__(":page_with_curl: You frantically search through your clues until you find the words to say to dispell the Black Dragon's Mystery.  She roars in fury as she becomes visible.  %d %s are scattered to the ground and lost in the scuffle.", usedClues, Text.pluralize("clue", usedClues))];
    }
    else if (FIGHT_ACTION_SOLVE_RIDDLE === type) {
      const difficulty = this.getDifficulty();
      const riddleIndex = this.getRiddleIndex(character, difficulty);
      const riddle = this.getRiddles(character, difficulty)[riddleIndex];

      this.clearFlag(FLAG_CHOSEN_RIDDLE);

      if (parseInt(info.choice) === riddle.correct) {
        this.incrementFlag(FLAG_NUM_ANSWERS);

        if (this.isDead()) {
          return [__("Tired of her nonsense, you ignore her ramblings and rush in and attack her, slaying her outright!")];
        }

        return [__("The Black Dragon coughs nervously and re-engages you in battle.\n\n\"%s\"\n", riddle.response)];
      }

      this.hp = this.maxHp;
      return [__("The Black Dragon laughs at your inability to solve her riddle.\n\n\"Pathetic fool!  Your embarassing performance empowers me!\"\n\nBefore your eyes, the wounds on her body close.  She appears entirely unharmed!")];
    }

    throw new Error(`Invalid Character Fight Action: '${type}'.`);
  }

  /**
   * Can the character use clues to dispell mystery?
   *
   * @param {Character} character - The character performing the action.
   * @param {string} type - The type of action being performed.
   *
   * @return {boolean}
   */
  canDoCharacterFightAction(character, type) {
    if (FIGHT_ACTION_USE_CLUE === type) {
      return character.inventory.has(ITEM_CLUE, this.getCluesRequired());
    }
    else if (FIGHT_ACTION_SOLVE_RIDDLE === type) {
      return true;
    }

    throw new Error(`Invalid Character Fight Action: '${type}'.`);
  }

  /**
   * Get the error that explains why this fight action cannot be performed.
   *
   * @param {Character} character - The character trying to do the action.
   * @param {string} type - The type of action to perform.
   *
   * @return {string}
   */
  getCharacterFightActionError(character, type) {
    if (FIGHT_ACTION_USE_CLUE === type) {
      return ":warning: You don't have sufficient Clues.";
    }

    throw new Error(`Invalid Character Fight Action: '${type}'.`);
  }

  /**
   * Get the button for using a clue.
   *
   * @param {Character} character - The character to get the button for.
   *
   * @return {object}
   */
  getUseClueAction(character) {
    const cluesRequired = this.getCluesRequired();
    const buttonText = __("Use %d %s", cluesRequired, Text.pluralize("Clue", cluesRequired));
    const style = character.inventory.has(ITEM_CLUE, cluesRequired) ? 'default' : 'danger';

    return Actions.getButton(buttonText, "fight_action", {
      params: {
        action: FIGHT_ACTIONS.ENEMY_ACTION,
        type: FIGHT_ACTION_USE_CLUE
      },
      style
    });
  }

  /**
   * Get a button for solving a riddle.
   *
   * @param {string} answer - The answer that can be picked.
   * @param {integer} choice - The index of the answer.
   *
   * @return {object}
   */
  getSolveRiddleAction(answer, choice) {
    return Actions.getButton(answer, "fight_action", {
      params: {
        action: FIGHT_ACTIONS.ENEMY_ACTION,
        type: FIGHT_ACTION_SOLVE_RIDDLE,
        choice
      }
    });
  }

  /**
   * Get the number of clues required to remove mystery.
   *
   * @return {integer}
   */
  getCluesRequired() {
    switch (this.getFlag(FLAG_MYSTERY_TURNS)) {
      case 5: return 10;
      case 4: return 7;
      case 3: return 4;
      case 2: return 2;
      case 1: return 1;
    }
  }

  /**
   * Smash the character from somewhere in mystery.
   *
   * @param {Character} character - The character being smashed.
   *
   * @return {array}
   */
  mysterySmash(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 1.5);
      const critText = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("The Black Dragon smashes you with her tail from somewhere in mystery for %s damage!%s", attackText, critText)];
    });
  }

  /**
   * Slice the character from somewhere in mystery.
   *
   * @param {Character} character - The character being sliced.
   *
   * @return {array}
   */
  mysterySlice(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 2);
      const critText = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("The Black Dragon slices you with her claws from somewhere in mystery for %s damage!%s", attackText, critText)];
    });
  }

  /**
   * Burn the character from somewhere in mystery.
   *
   * @param {Character} character - The character being burned.
   *
   * @return {array}
   */
  mysteryFlame(character) {
    const dodgeText = __("A gout of flame appears from out of nowhere, but you manage to dodge it!");
    const missText = __("A gout of flame appears out of nowhere, but nowhere near you.");

    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 2.5);
      const critText = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__(":fire: A gout of flame appears from out of nowhere and crisps you for %s damage!%s", attackText, critText)];
    }, [PROPERTIES.BURN_ATTACK], dodgeText, missText);
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

    if (this.hasFlag(FLAG_MYSTERY_TURNS)) {
      this.decrementFlag(FLAG_MYSTERY_TURNS);

      if (this.hasFlag(FLAG_MYSTERY_TURNS)) {
        const turns = this.getFlag(FLAG_MYSTERY_TURNS);
        messages.push(__(":crystal_ball: The Black Dragon is shrouded in mystery and will remain so for %d more %s.", turns, Text.pluralize("turn", turns)));
      }
    }

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
    messages = super.doFightRun(character, messages);

    this.leaveLabyrinth(character);
    messages.push(__("The %s chases you right out of the Labyrinth!", this.getDisplayName(character)));

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
    messages = super.doFightFailure(character, messages);

    this.leaveLabyrinth(character);
    messages.push(__("As you pass into unconsciousness, you can feel your body being dragged out of the Labyrinth.", this.getDisplayName(character)));

    return messages;
  }

  /**
   * Move the character out of the Labyrinth into the quad.
   *
   * @param {Character} character - The character being moved out of the Labyrinth.
   */
  leaveLabyrinth(character) {
    const Locations = require('@app/content/locations').Locations;
    character.location = Locations.new('watermoon-scholar-quad');
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
    // Gotta define this in here to avoid circular content file references
    const Locations = require('@app/content/locations').Locations;
    character.location = Locations.new('watermoon-gilded-exchange');

    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-minotaur');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-gorgon');
    character.clearFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-empusa');
    character.clearFlag(FLAGS.HALLWAY_CHOICES);
    character.clearFlag(FLAGS.HALLWAY_REMAINING);
    character.clearFlag(FLAGS.HALLWAYS_COMPLETED);

    character.setFlag(FLAGS.IN_CUTSCENE);
    character.setFlag(FLAGS.SCHOLAR_BOSS, Random.fromArray([
      'watermoon-scholar-minotaur_king',
      'watermoon-scholar-gorvil',
      'watermoon-scholar-maze_master',
    ]));

    character.track('Black Dragon Killed');

    messages = messages.concat([
      __("The Black Dragon reels from your blow, collapsing to the ground.  \"How dare you!  I was asking... a... riddle...\" she wheezes, as she expires."),
      __("You lean forward and embrace the Black Dragon with Phaera's flame, and watch as it consumes her entire body.  As it returns to you, you feel lighter."),
      __("You head back to town to report in to Aureth, who seems to already know your deed."),
      { npc: 'aureth', text: __('"Do you feel it?  Do you feel... just... better?  Yeah, me too.  I was never familiar with the Black Dragon that moved in over there, but you could feel the fear and intimidation she lived by throughout the whole town."') },
      { npc: 'aureth', text: __('"Nice!  Just the one dragon left!  All you gotta do is head over to the Mystic district and handle that gross old Necrodragon."') },
      { npc: 'aureth', text: __('"Cassiopeia - that\'s her name, the "Necrodragon" - was always bigger than her britches, you know?  Now she figures that since she knows some Necromancy, she can take over a whole district, animate a bunch of corpses, and hire a bunch of goons."') },
      { npc: 'aureth', text: __('"Honestly, you\'ll be doing us all a favour by getting rid of her."') },
      { npc: 'aureth', text: __('"Oh!  And make sure to check out the merchants.  They\'ve been resupplied again with more interesting and useful equipment."') },
    ]);

    character.slashbot.tellStory(messages, character);

    return [];
  }
}

module.exports = BlackDragonEnemy;