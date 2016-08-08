# respec-given-lab

[![Build Status](https://travis-ci.org/cades/respec-given-lab.svg?branch=master)](https://travis-ci.org/cades/respec-given-lab)

respec-given-lab is an extension to the lab testing framework. It encourages cleaner, readable, and maintainable specs/tests using `Given`, `When`, and `Then`.

## Installation

install `respec-given-lab` locally

    npm install --save-dev lab respec-given-lab

## Usage

```coffeescript
Lab = require('lab')
lab = exports.lab = Lab.script()
gwt = require('respec-given-lab')(lab)
{describe, context, Given, When, Then, And} = gwt
```


### Transform test code

`respec-given` provides a tool, which can analysis test code's `Then` expression, gather context information, and generate code that carries these information. When assertion failed (return false), these information are used to evaluate failed Then clause's subexpression and generate diagnosis message for you. Since `lab` already provide `--transform` option, applying the tool is easy. Just write a `transform.js`:

```js
var coffee = require('coffee-script')
var transform = require('respec-given-lab/transform')

module.exports = [
  { ext: '.js', transform: (content, filename) => {
    if (filename.indexOf('node_modules') !== -1)
      return content

    return transform(content, filename)
  } },
  { ext: '.coffee', transform: (content, filename) => {
    if (filename.indexOf('node_modules') !== -1)
      return content

    const result = coffee.compile(content, {
      sourceMap: true,
      inline: true,
      sourceRoot: '/',
      sourceFiles: [filename]
    })

    return transform(result.js, filename)
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

Here is a spec written in respec-given and CoffeeScript. (for JavaScript example, click [here](#lexical-style))

```coffeescript
Lab = require('lab')
lab = exports.lab = Lab.script()
gwt = require('respec-given-lab')(lab)
{describe, context, Given, GivenI, When, Invariant, Then, And} = gwt

Stack = require('../stack')

describe 'Stack', ->

  stack_with = (initial_contents) ->
    stack = Object.create Stack
    initial_contents.forEach (item) -> stack.push(item)
    stack

  Given stack: -> stack_with(@initial_contents)
  Invariant -> @stack.empty() == (@stack.depth() == 0)

  context "with no items", ->
    Given initial_contents: -> []
    Then -> @stack.depth() == 0

    context "when pushing", ->
      When -> @stack.push('an_item')

      Then -> @stack.depth() == 1
      Then -> @stack.top() == 'an_item'

  context "with one item", ->
    Given initial_contents: -> ['an_item']

    context "when popping", ->
      When pop_result: -> @stack.pop()

      Then -> @pop_result == 'an_item'
      Then -> @stack.depth() == 0

  context "with several items", ->
    Given initial_contents: -> ['second_item', 'top_item']
    GivenI original_depth: -> @stack.depth()

    context "when pushing", ->
      When -> @stack.push('new_item')

      Then -> @stack.top() == 'new_item'
      Then -> @stack.depth() == @original_depth + 1

    context "when popping", ->
      When pop_result: -> @stack.pop()

      Then -> @pop_result == 'top_item'
      Then -> @stack.top() == 'second_item'
      Then -> @stack.depth() == @original_depth - 1
```

click [here](https://github.com/cades/respec-given#given) to see detail API documentation.
