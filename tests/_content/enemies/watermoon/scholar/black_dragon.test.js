/*eslint-env mocha */
"use strict";

const Character        = require('@app/character').Character;
const BlackDragonEnemy = require('@content/enemies/watermoon/scholar/black_dragon');

const FLAGS = require('@constants').FLAGS;

const FLAG_MYSTERY_TURNS = 'mystery_turns';
const FLAG_NUM_ANSWERS = 'num_answers';
const FLAG_CHOSEN_RIDDLE = 'chosen_riddle';

const ITEM_CLUE = 'quest-watermoon-clue';
const FIGHT_ACTION_USE_CLUE = 'use_clue';
const FIGHT_ACTION_SOLVE_RIDDLE = 'riddle';

const DIFFICULTY_EASY = 'easy';
const DIFFICULTY_HARD = 'hard';
const DIFFICULTY_IMPOSSIBLE = 'impossible';

describe('BlackDragonEnemy', () => {
  describe('getDescription()', () => {
    it('should include extra description for mystery and riddles', () => {
      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_CHOSEN_RIDDLE, 0);
      dragon.getRiddles = jest.fn(() => [
        { question: 'this is the question' }
      ]);

      expect(dragon.getDescription({})).toEqual(
        expect.stringContaining('this is the question')
      );
    });
  });

  describe('getFightActions', () => {
    it('should get beginning standard actions', () => {
      let character = new Character();
      character.setFlag(FLAGS.CURSED_TURNS);
      const dragon = new BlackDragonEnemy();

      expect(dragon.getFightActions(character, {})).toEqual({
        getFurious: 20,
        mysteryAttack: 10,
        burn: 20,
        blind: 10,
        concuss: 0,
        doStun: 0,
        curseAttack: 10,
        doAttack: 30,
      });
    });

    it('should concuss below 66% health', () => {
      let character = new Character();
      character.setFlag(FLAGS.CURSED_TURNS);
      const dragon = new BlackDragonEnemy();
      dragon.maxHp = 100;
      dragon.hp = 65;
      dragon.setFlag(FLAG_NUM_ANSWERS, 1);

      expect(dragon.getFightActions(character, {})).toEqual({
        getFurious: 20,
        mysteryAttack: 10,
        burn: 20,
        blind: 10,
        concuss: 20,
        doAttack: 20,
      });
    });

    it('should stun below 33% health', () => {
      let character = new Character();
      character.setFlag(FLAGS.CURSED_TURNS);
      let dragon = new BlackDragonEnemy();
      dragon.maxHp = 100;
      dragon.hp = 32;
      dragon.setFlag(FLAG_NUM_ANSWERS, 2);

      expect(dragon.getFightActions(character, {})).toEqual({
        getFurious: 20,
        mysteryAttack: 10,
        burn: 20,
        blind: 10,
        doStun: 20,
        doAttack: 20,
      });
    });

    it('should perform mystery attacks when cloaked in mystery', () => {
      let character = new Character();
      character.setFlag(FLAGS.CURSED_TURNS);
      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_MYSTERY_TURNS);

      expect(dragon.getFightActions(character, {})).toEqual({
        mysterySmash: 40,
        mysterySlice: 40,
        mysteryFlame: 20
      });
    });
  });

  describe('doFightAction()', () => {
    it('should ask riddle instead of provided fight action', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();
      dragon.doAttack = jest.fn();

      dragon.doFightAction('doAttack', character);
      expect(dragon.doAttack).toHaveBeenCalledWith(character);

      dragon.askRiddle = jest.fn();
      dragon.shouldAskRiddle = jest.fn(() => true);
      dragon.doFightAction('doAttack', character);
      expect(dragon.askRiddle).toHaveBeenCalledWith(character);
    });
  });

  describe('shouldAskRiddle()', () => {
    it('shouldnt ask riddle if riddle is being answered', () => {
      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_CHOSEN_RIDDLE);

      expect(dragon.shouldAskRiddle()).toBe(false);
    });

    it('should ask a riddle only once at 66% health', () => {
      let dragon = new BlackDragonEnemy();
      dragon.maxHp = 100;
      dragon.hp = 65;

      expect(dragon.shouldAskRiddle()).toBe(true);

      dragon.setFlag(FLAG_NUM_ANSWERS, 1);
      expect(dragon.shouldAskRiddle()).toBe(false);
    });

    it('should ask a riddle only once at 33% health', () => {
      let dragon = new BlackDragonEnemy();
      dragon.maxHp = 100;
      dragon.hp = 32;

      expect(dragon.shouldAskRiddle()).toBe(true);

      dragon.setFlag(FLAG_NUM_ANSWERS, 2);
      expect(dragon.shouldAskRiddle()).toBe(false);
    });

    it('should ask a riddle at deaths door', () => {
      let dragon = new BlackDragonEnemy();
      dragon.maxHp = 100;
      dragon.hp = 0;

      expect(dragon.shouldAskRiddle()).toBe(true);
    });
  });

  describe('askRiddle()', () => {
    it('should pick and ask the riddle', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();
      dragon.chooseRiddle = jest.fn(() => 1);
      dragon.getRiddles = jest.fn(() => [
        {},
        { question: "this is where a riddle would go"}
      ]);

      expect(dragon.askRiddle(character)).toEqual(
        expect.stringContaining("this is where a riddle would go")
      );
      expect(dragon.getFlag(FLAG_CHOSEN_RIDDLE)).toEqual(1);
    });

    it('should get saved riddle', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_CHOSEN_RIDDLE, 2);
      dragon.getRiddles = jest.fn(() => [
        {},
        {},
        { question: "this is where a riddle would go"}
      ]);

      expect(dragon.askRiddle(character)).toEqual(
        expect.stringContaining("this is where a riddle would go")
      );
    });
  });

  describe('getDifficulty()', () => {
    it('should get the appropriate difficulty', () => {
      let dragon = new BlackDragonEnemy();

      dragon.maxHp = 100;
      dragon.hp = 65;
      expect(dragon.getDifficulty()).toBe(DIFFICULTY_EASY);

      dragon.hp = 32;
      expect(dragon.getDifficulty()).toBe(DIFFICULTY_HARD);

      dragon.hp = 0;
      expect(dragon.getDifficulty()).toBe(DIFFICULTY_IMPOSSIBLE);
    });
  });

  describe('getRiddleIndex()', () => {
    it('should get the riddle from flag or randomly', () => {
      let dragon = new BlackDragonEnemy();
      dragon.chooseRiddle = jest.fn(() => 50);

      expect(dragon.getRiddleIndex({}, 'abc')).toBe(50);

      dragon.setFlag(FLAG_CHOSEN_RIDDLE, 25);
      expect(dragon.getRiddleIndex({}, 'abc')).toBe(25);
    });
  });

  describe('getRiddles()', () => {
    it('should get riddles for valid difficulties', () => {
      const dragon = new BlackDragonEnemy();

      expect(dragon.getRiddles({}, DIFFICULTY_EASY)).toEqual(expect.any(Array));
      expect(dragon.getRiddles({}, DIFFICULTY_HARD)).toEqual(expect.any(Array));
      expect(dragon.getRiddles({}, DIFFICULTY_IMPOSSIBLE)).toEqual(expect.any(Array));

      expect(() => {
        dragon.getRiddles({}, 'invalid');
      }).toThrowError("Invalid difficulty: 'invalid'.");
    });
  });

  describe('isDead()', () => {
    it('should only die when all 3 riddles are solved', () => {
      let dragon = new BlackDragonEnemy();

      expect(dragon.isDead()).toBe(false);

      dragon.setFlag(FLAG_NUM_ANSWERS, 3);
      expect(dragon.isDead()).toBe(true);
    });
  });

  describe('mysteryAttack()', () => {
    it('should enter the mystery state', () => {
      let dragon = new BlackDragonEnemy();
      expect(dragon.mysteryAttack({})).toEqual([
        ":crystal_ball: The Black Dragon wraps herself in mystery, disappearing from your view and disorienting you!"
      ]);
      expect(dragon.getFlag(FLAG_MYSTERY_TURNS)).toBe(6);
    });
  });

  describe('modifyActions()', () => {
    it('should add mystery buttons', () => {
      let character = new Character();
      character.setValues();
      character.inventory.add(ITEM_CLUE, 10);

      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_MYSTERY_TURNS, 5);

      expect(dragon.modifyActions(character, {})).toEqual({
        collection: [{
          name: "do_nothing",
          text: "Do Nothing",
          type: "button",
          value: 'fight_action|{"action":"do_nothing"}'
        }, {
          name: "use_10_clues",
          style: "default",
          text: "Use 10 Clues",
          type: "button",
          value: 'fight_action|{"action":"enemy_action","type":"use_clue"}'
        }]
      });
    });

    it('should add riddle buttons', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_CHOSEN_RIDDLE, 0);
      dragon.getRiddles = jest.fn(() => [
        {
          question: "this is the question",
          answers: [
            __("Answer A"),
            __("Answer B"),
            __("Answer C"),
          ],
          correct: 2,
          response: __("this is the response")
        }
      ]);

      expect(dragon.modifyActions(character, {})).toEqual({
        collection: [{
          name: "answer_a",
          text: "Answer A",
          type: "button",
          value: 'fight_action|{"action":"enemy_action","type":"riddle","choice":"0"}'
        }, {
          name: "answer_b",
          text: "Answer B",
          type: "button",
          value: 'fight_action|{"action":"enemy_action","type":"riddle","choice":"1"}'
        }, {
          name: "answer_c",
          text: "Answer C",
          type: "button",
          value: 'fight_action|{"action":"enemy_action","type":"riddle","choice":"2"}'
        }]
      });
    });
  });

  describe('modifySkillActions()', () => {
    it('should disable skill actions if in mystery or asking riddle', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();

      const sentinelActions = { actions: 123 };
      expect(dragon.modifySkillActions(character, sentinelActions)).toEqual(sentinelActions);

      dragon.setFlag(FLAG_MYSTERY_TURNS);
      expect(dragon.modifySkillActions(character, sentinelActions)).toEqual({ collection: [] });

      dragon.clearFlag(FLAG_MYSTERY_TURNS);
      dragon.setFlag(FLAG_CHOSEN_RIDDLE);
      expect(dragon.modifySkillActions(character, sentinelActions)).toEqual({ collection: [] });
    });
  });

  describe('doCharacterFightAction()', () => {
    it('should remove clues and mystery both', () => {
      let character = new Character();
      character.setValues();
      character.inventory.add(ITEM_CLUE, 15);

      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_MYSTERY_TURNS, 5);

      expect(dragon.doCharacterFightAction(character, FIGHT_ACTION_USE_CLUE, {})).toEqual([
        ":page_with_curl: You frantically search through your clues until you find the words to say to dispell the Black Dragon's Mystery.  She roars in fury as she becomes visible.  10 clues are scattered to the ground and lost in the scuffle."
      ]);
      expect(character.inventory.quantity(ITEM_CLUE)).toBe(5);
      expect(dragon.hasFlag(FLAG_MYSTERY_TURNS)).toBe(false);
    });

    it('should return to full health on incorrect answer', () => {
      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_CHOSEN_RIDDLE, 1);
      dragon.maxHp = 100;
      dragon.hp = 50;
      dragon.getRiddleIndex = jest.fn(() => 0);
      dragon.getRiddles = jest.fn(() => [{ correct: 1 }]);

      expect(dragon.doCharacterFightAction({}, FIGHT_ACTION_SOLVE_RIDDLE, { choice: 5 })).toEqual([
        "The Black Dragon laughs at your inability to solve her riddle.\n\n\"Pathetic fool!  Your embarassing performance empowers me!\"\n\nBefore your eyes, the wounds on her body close.  She appears entirely unharmed!"
      ]);
      expect(dragon.hp).toBe(dragon.maxHp);
      expect(dragon.hasFlag(FLAG_CHOSEN_RIDDLE)).toBe(false);
    });

    it('should continue the fight on correct answer', () => {
      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_CHOSEN_RIDDLE, 1);
      dragon.getRiddles = jest.fn(() => [{}, {
        correct: 1,
        response: __("this is the response")
      }]);

      expect(dragon.doCharacterFightAction({}, FIGHT_ACTION_SOLVE_RIDDLE, { choice: 1 })).toEqual([
        expect.stringContaining("this is the response")
      ]);
      expect(dragon.hasFlag(FLAG_CHOSEN_RIDDLE)).toBe(false);
      expect(dragon.getFlag(FLAG_NUM_ANSWERS)).toBe(1);
    });

    it('should throw an error if invalid type', () => {
      let dragon = new BlackDragonEnemy();

      expect(() => {
        dragon.doCharacterFightAction({}, 'invalid', {});
      }).toThrowError("Invalid Character Fight Action: 'invalid'.");
    });
  });

  describe('canDoCharacterFightAction()', () => {
    it('should be able to use clues only if enough clues owned', () => {
      let character = new Character();
      character.setValues();

      let dragon = new BlackDragonEnemy();
      dragon.getCluesRequired = jest.fn(() => 10);

      expect(dragon.canDoCharacterFightAction(character, FIGHT_ACTION_USE_CLUE)).toBe(false);

      character.inventory.add(ITEM_CLUE, 10);
      expect(dragon.canDoCharacterFightAction(character, FIGHT_ACTION_USE_CLUE)).toBe(true);
    });

    it('should always be able to answer riddles', () => {
      let dragon = new BlackDragonEnemy();
      expect(dragon.canDoCharacterFightAction({}, FIGHT_ACTION_SOLVE_RIDDLE)).toBe(true);
    });

    it('should throw an error if invalid type', () => {
      let dragon = new BlackDragonEnemy();

      expect(() => {
        dragon.canDoCharacterFightAction({}, 'invalid');
      }).toThrowError("Invalid Character Fight Action: 'invalid'.");
    });
  });

  describe('getCharacterFightActionError()', () => {
    it('should describe why you cant use clues', () => {
      let character = new Character();

      let dragon = new BlackDragonEnemy();
      expect(dragon.getCharacterFightActionError(character, FIGHT_ACTION_USE_CLUE)).toBe(
        ":warning: You don't have sufficient Clues."
      );
    });

    it('should throw an error for incorrect types', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();

      expect(() => {
        dragon.getCharacterFightActionError(character, 'invalid');
      }).toThrowError("Invalid Character Fight Action: 'invalid'.");
    });
  });

  describe('getUseClueAction()', () => {
    it('should build an action button for using clues', () => {
      let character = new Character();
      character.setValues();
      character.inventory.add(ITEM_CLUE, 15);

      let dragon = new BlackDragonEnemy();
      dragon.getCluesRequired = jest.fn(() => 10);

      expect(dragon.getUseClueAction(character)).toEqual({
        name: "use_10_clues",
        style: "default",
        text: "Use 10 Clues",
        type: "button",
        value: 'fight_action|{"action":"enemy_action","type":"use_clue"}'
      });
    });

    it('should show red button when not enough clues', () => {
      let character = new Character();
      character.setValues();
      character.inventory.add(ITEM_CLUE, 5);

      let dragon = new BlackDragonEnemy();
      dragon.getCluesRequired = jest.fn(() => 10);

      expect(dragon.getUseClueAction(character)).toEqual({
        name: "use_10_clues",
        style: "danger",
        text: "Use 10 Clues",
        type: "button",
        value: 'fight_action|{"action":"enemy_action","type":"use_clue"}'
      });
    });
  });

  describe('getCluesRequired()', () => {
    it('should require the correct amount of clues', () => {
      let dragon = new BlackDragonEnemy();

      dragon.setFlag(FLAG_MYSTERY_TURNS, 5);
      expect (dragon.getCluesRequired()).toBe(10);

      dragon.setFlag(FLAG_MYSTERY_TURNS, 4);
      expect (dragon.getCluesRequired()).toBe(7);

      dragon.setFlag(FLAG_MYSTERY_TURNS, 3);
      expect (dragon.getCluesRequired()).toBe(4);

      dragon.setFlag(FLAG_MYSTERY_TURNS, 2);
      expect (dragon.getCluesRequired()).toBe(2);

      dragon.setFlag(FLAG_MYSTERY_TURNS, 1);
      expect (dragon.getCluesRequired()).toBe(1);
    });
  });

  describe('mysterySmash()', () => {
    it('should smash the character', () => {
      let character = new Character();
      character.setValues();

      let dragon = new BlackDragonEnemy();
      dragon.getAttackInfo = jest.fn(() => {
        return {
          damage: 1,
          didCrit: true,
          didDodge: false,
          didMiss: false,
          extraMessages: [],
        };
      });

      expect(dragon.mysterySmash(character)).toEqual([
        "The Black Dragon smashes you with her tail from somewhere in mystery for *2* damage! _Critical hit!_"
      ]);
    });
  });

  describe('mysterySlice()', () => {
    it('should slice the character', () => {
      let character = new Character();
      character.setValues();

      let dragon = new BlackDragonEnemy();
      dragon.getAttackInfo = jest.fn(() => {
        return {
          damage: 1,
          didCrit: true,
          didDodge: false,
          didMiss: false,
          extraMessages: [],
        };
      });

      expect(dragon.mysterySlice(character)).toEqual([
        "The Black Dragon slices you with her claws from somewhere in mystery for *2* damage! _Critical hit!_"
      ]);
    });
  });

  describe('mysteryFlame()', () => {
    it('should burn the character', () => {
      let character = new Character();
      character.setValues();

      let dragon = new BlackDragonEnemy();
      dragon.getAttackInfo = jest.fn(() => {
        return {
          damage: 1,
          didCrit: true,
          didDodge: false,
          didMiss: false,
          extraMessages: [],
        };
      });

      expect(dragon.mysteryFlame(character)).toEqual([
        ":fire: A gout of flame appears from out of nowhere and crisps you for *3* damage! _Critical hit!_"
      ]);
      expect(character.hasFlag(FLAGS.BURNED_TURNS));
    });
  });

  describe('doPostRoundActions()', () => {
    it('should lower the number of mystery turns remaining', () => {
      const character = new Character();

      let dragon = new BlackDragonEnemy();
      dragon.setFlag(FLAG_MYSTERY_TURNS, 5);

      expect(dragon.doPostRoundActions(character)).toEqual([
        ":crystal_ball: The Black Dragon is shrouded in mystery and will remain so for 4 more turns."
      ]);
    });
  });

  describe('doFightRun()', () => {
    it('should leave the labyrinth', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();
      dragon.leaveLabyrinth = jest.fn();

      expect(dragon.doFightRun(character, [])).toEqual([
        "The Black Dragon chases you right out of the Labyrinth!"
      ]);
      expect(dragon.leaveLabyrinth).toHaveBeenCalledWith(character);
    });
  });

  describe('doFightFailure()', () => {
    it('should leave the labyrinth', () => {
      let character = new Character();
      let dragon = new BlackDragonEnemy();
      dragon.leaveLabyrinth = jest.fn();

      expect(dragon.doFightFailure(character, [])).toEqual([
        "As you pass into unconsciousness, you can feel your body being dragged out of the Labyrinth."
      ]);
      expect(dragon.leaveLabyrinth).toHaveBeenCalledWith(character);
    });
  });

  describe('leaveLabyrinth()', () => {
    it('should move you to the quad', () => {
      let character = new Character();
      character.setValues();
      const dragon = new BlackDragonEnemy();

      dragon.leaveLabyrinth(character);

      expect(character.location.type).toBe('watermoon-scholar-quad');
    });
  });

  describe('doFightSuccess()', () => {
    it('should perform success actions', () => {
      let character = new Character();
      character.slashbot = { tellStory: jest.fn() };
      character.setValues();
      character.setFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-minotaur');
      character.setFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-gorgon');
      character.setFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-empusa');
      character.setFlag(FLAGS.HALLWAY_CHOICES);
      character.setFlag(FLAGS.HALLWAY_REMAINING);
      character.setFlag(FLAGS.HALLWAYS_COMPLETED);

      const dragon = new BlackDragonEnemy();

      dragon.doFightSuccess(character, []);

      expect(character.location.type).toBe('watermoon-gilded-exchange');

      expect(character.hasFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-minotaur')).toBe(false);
      expect(character.hasFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-gorgon')).toBe(false);
      expect(character.hasFlag(FLAGS.BOSS_DEFEATED_ + 'watermoon-scholar-empusa')).toBe(false);
      expect(character.hasFlag(FLAGS.HALLWAY_CHOICES)).toBe(false);
      expect(character.hasFlag(FLAGS.HALLWAY_REMAINING)).toBe(false);
      expect(character.hasFlag(FLAGS.HALLWAYS_COMPLETED)).toBe(false);

      expect(character.hasFlag(FLAGS.IN_CUTSCENE)).toBe(true);

      const potentialBosses = [
        'watermoon-scholar-minotaur_king',
        'watermoon-scholar-gorvil',
        'watermoon-scholar-maze_master',
      ];
      expect(potentialBosses.includes(character.getFlag(FLAGS.SCHOLAR_BOSS))).toBe(true);
    });
  });
});