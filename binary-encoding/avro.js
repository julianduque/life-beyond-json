const fs = require('fs')
const path = require('path')
const assert = require('assert')
const avro = require('avsc')
const character = require('./character.json')

const schema = fs.readFileSync(path.join(__dirname, 'schema', 'Character.avsc'), 'utf8')

const type = avro.Type.forSchema(JSON.parse(schema))
const buffer = type.toBuffer(character)
const value = type.fromBuffer(buffer)

console.log('JSON Size: ', Buffer.byteLength(JSON.stringify(character)))
console.log('Avro Size: ', Buffer.byteLength(buffer))

assert(type.isValid(character))
assert.deepEqual(value, character)
fs.writeFileSync(path.join(__dirname, 'out', 'character-avro.dat'), buffer)
