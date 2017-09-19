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
        attack: function(anemy, n) {
          return anemy.hit_points -= n;
        }
      };
    };

    Given('attacker', () => Character("Attacker"));
    Given('defender', () => Character("Defender"));

    describe('sync function', () => {
      GivenI('original_hp', function() { return this.defender.hit_points; });
      When(function() { return this.attacker.attack(this.defender, 1); });
      Then(function() { return this.defender.hit_points === this.original_hp - 1; });
    });

    describe('sync function that return a promise', () => {
      GivenI('original_hp', function() { return Promise.resolve(this.defender.hit_points); });
      When(function() { return this.attacker.attack(this.defender, 1); });
      Then(function() { return this.defender.hit_points === this.original_hp - 1; });
    });

    describe('async function', () => {
      GivenI('original_hp', function(done) {
        setTimeout(function() {
          done(null, this.defender.hit_points);
        }.bind(this), 0)
      });
      When(function() { return this.attacker.attack(this.defender, 1); });
      Then(function() { return this.defender.hit_points === this.original_hp - 1; });
    });
  });

  describe('support promise', () => {
    GivenI(function() {
      return Promise.resolve().then(function() {
        this.result = 'cool';
      }.bind(this));
    });
    Then(function() { return this.result === 'cool'; });
  });

  describe('support generator', () => {
    Given(function*() { this.result = (yield Promise.resolve('cool')); });
    Then(function() { return this.result === 'cool'; });
  });

  describe('support observable', () => {
    Given(function() {
      return Observable.of('cool').map(function(x) {
        this.result = x;
      }.bind(this));
    });
    Then(function() { return this.result === 'cool'; });
  });
});

describe("GivenI(hash)", () => {
  describe('support function', () => {
    GivenI({
      result: () => 'cool'
    });
    Then(function() { return this.result === 'cool'; });
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
