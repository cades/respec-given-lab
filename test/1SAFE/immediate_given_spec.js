const Lab = require('lab');
const lab = exports.lab = Lab.script();
const {
  describe, context,
  Given, GivenI, When, Then, And
} = require('respec-given-lab')(lab);
const Observable = require("zen-observable");

describe("GivenI(var, fn)", () => {
  context('example: Character can be damaged', () => {
    const Character = name => {
      return {
        hit_points: 20,
        attack: (anemy, n) => anemy.hit_points -= n
      };
    };

    Given('attacker', () => Character("Attacker"));
    Given('defender', () => Character("Defender"));

    describe('sync function', () => {
      GivenI('original_hp', $ => $.defender.hit_points);
      When($ => $.attacker.attack($.defender, 1));
      Then($ => $.defender.hit_points === $.original_hp - 1);
    });

    describe('sync function that return a promise', () => {
      GivenI('original_hp', $ => Promise.resolve($.defender.hit_points));
      When($ => $.attacker.attack($.defender, 1));
      Then($ => $.defender.hit_points === $.original_hp - 1);
    });

    describe('async function', () => {
      GivenI('original_hp', ($, done) => {
        setTimeout(() => {
          done(null, $.defender.hit_points);
        }, 0)
      });
      When($ => $.attacker.attack($.defender, 1));
      Then($ => $.defender.hit_points === $.original_hp - 1);
    });
  });

  describe('support promise', () => {
    GivenI($ => Promise.resolve().then(() => $.result = 'cool'));
    Then($ => $.result === 'cool');
  });

  describe('support generator', () => {
    Given(function*($) { $.result = (yield Promise.resolve('cool')); });
    Then($ => $.result === 'cool');
  });

  describe('support observable', () => {
    Given($ => Observable.of('cool').map(x => $.result = x));
    Then($ => $.result === 'cool');
  });
});

describe("GivenI(hash)", () => {
  describe('support function', () => {
    GivenI({
      result: () => 'cool'
    });
    Then($ => $.result === 'cool');
  });
});

describe('GivenI(varname, value) is forbidden', () => {
  var e, message = null;
  try {
    GivenI({x: 1});
  } catch (error) {
    e = error;
    message = e.message;
  }
  Then(() => null !== message.match(/GivenI.*no function provided/));
});
