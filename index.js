var evaluate = require('boolean-json-eval')
var omit = require('object-omit')

var defaultConditionKey = '$condition'

function defaultConditioner(object) {
  if (defaultConditionKey in object) {
    return {
      condition: object.$condition,
      value: omit(object, defaultConditionKey) } }
  else {
    return { value: object } } }

function retain(argument) {
  return { retain: true, value: argument } }

function instructionFor(argument, variables, conditioner) {
  if (typeof argument !== 'object') {
    return retain(argument) }
  else if (Array.isArray(argument)) {
    return retain(argument) }
  else {
    var analysis = conditioner(argument)
    if ('condition' in analysis) {
      if (evaluate(analysis.condition, variables)) {
        return retain(analysis.value) }
      else {
        return { retain: false } } }
    else {
      return retain(analysis.value) } } }

function conditionalJSON(argument, variables, conditioner) {
  if (conditioner === undefined) {
    conditioner = defaultConditioner }
  if (Array.isArray(argument)) {
    return retain(argument.reduce(
      function(result, element) {
        var instruction = instructionFor(element, variables, conditioner)
        if (instruction.retain) {
          result.push(instruction.value) }
        return result },
      [ ])) }
  else if (typeof argument === 'object') {
    var instruction = instructionFor(argument, variables, conditioner)
    if (instruction.retain) {
      return retain(Object.keys(instruction.value)
        .reduce(
          function(result, key) {
            var value = instruction.value[key]
            var valueInstruction = conditionalJSON(value, variables, conditioner)
            if (valueInstruction.retain) {
              result[key] = valueInstruction.value }
            return result },
          { })) }
    else {
      return instruction } }
  else {
    return retain(argument) } }

module.exports = conditionalJSON
