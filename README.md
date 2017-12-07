# respec-given-lab

[![Build Status](https://travis-ci.org/cades/respec-given-lab.svg?branch=master)](https://travis-ci.org/cades/respec-given-lab)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcades%2Frespec-given-lab.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcades%2Frespec-given-lab?ref=badge_shield)

respec-given-lab is an extension to the lab testing framework. It encourages cleaner, readable, and maintainable specs/tests using `Given`, `When`, and `Then`.

## Installation

install `respec-given-lab` locally

    npm install --save-dev lab respec-given-lab

## Usage

```javascript
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const {describe, context, Given, When, Then, And} = require('respec-given-lab')(lab);
```


### Transform test code

`respec-given` provides a tool, which can analysis test code's `Then` expression, gather context information, and generate code that carries these information. When assertion failed (return false), these information are used to evaluate failed Then clause's subexpression and generate diagnosis message for you. Since `lab` already provide `--transform` option, applying the tool is easy. Just write a `transform.js`:

```js
var transform = require('respec-given-lab/transform')

module.exports = [
  { ext: '.js', transform: (content, filename) => {
    if (filename.indexOf('node_modules') !== -1)
      return content

    return transform(content, filename)
  } }
]
```

#### Why tooling?

Because in JavaScript, lexical binding can not be "captured" during execution time. Lexical binding is resolved at lex time, it's the world view of specific block of code. You have no way to share this view to others (in JavaScript). For example:

```js
    var x = 1
    Then(function() { return x == 0 })
```

`Then` received a function, which returns `false`. Even `Then` can know `x`'s existence by analysis `fn.toString()`, `Then` have no way to access `x`. No.

This is a meta-programming problem, which can not be solved in JavaScript itself. That's why we need a loader (preprocessor, transpiler, instrumenter, whatever you like to call it).

#### When do I need it?

When you use natural assertion, transformed test code would generate more helpful error message for you.

On the other hand, if you are using assertion library (like node.js built-in `assert`, `chai.js`, `expect.js`, or `shouldjs`), which provide their diagnosis message already, then you don't need natural assertion loader.



## Example

Here is a spec written in respec-given.

```javascript
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const {describe, context, Given, GivenI, When, Invariant, Then, And} = require('respec-given-lab')(lab);

const Stack = require('../stack');

describe('Stack', () => {

  const stack_with = (initial_contents) => {
    const stack = Object.create(Stack);
    initial_contents.forEach(item => stack.push(item));
    return stack;
  };

  Given({stack: function() { return stack_with(this.initial_contents); }});
  Invariant(function() { return this.stack.empty() === (this.stack.depth() === 0); });

  context("with no items", () => {
    Given({initial_contents: () => []});
    Then(function() { return this.stack.depth() === 0; });

    context("when pushing", () => {
      When(function() { this.stack.push('an_item'); });

      Then(function() { return this.stack.depth() === 1; });
      Then(function() { return this.stack.top() === 'an_item'; });
    });
  });

  context("with one item", () => {
    Given({initial_contents: () => ['an_item']});

    context("when popping", () => {
      When({pop_result: function() { this.stack.pop(); }});

      Then(function() { return this.pop_result === 'an_item'; });
      Then(function() { return this.stack.depth() === 0; });
    });
  });

  context("with several items", () => {
    Given({initial_contents: () => ['second_item', 'top_item']});
    GivenI({original_depth: function() { return this.stack.depth(); } });

    context("when pushing", () => {
      When(function() { this.stack.push('new_item'); });

      Then(function() { return this.stack.top() === 'new_item'; });
      Then(function() { return this.stack.depth() === this.original_depth - 1; });
    });

    context("when popping", () => {
      When({pop_result: function() { this.stack.pop(); }});

      Then(function() { return this.pop_result === 'top_item'; });
      Then(function() { return this.stack.top() === 'second_item'; });
      Then(function() { return this.stack.depth() === this.original_depth - 1; });
    });
  });
});
```

click [here](https://github.com/cades/respec-given#given) to see detail API documentation.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcades%2Frespec-given-lab.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcades%2Frespec-given-lab?ref=badge_large)