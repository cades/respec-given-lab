Lab = require('lab')
lab = exports.lab = Lab.script()
gwt = require('respec-given-lab')(lab)
{describe, context} = gwt
{Then} = gwt

expect = require 'expect.js'

describe "Then(fn)", ->

  context 'with natural assertion', ->
    Then -> 1 == 1

  context 'with assertion library', ->
    Then -> expect(1).to.be(1)

  context 'support promise', ->
    Then -> Promise.resolve(1)
