const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { encode, decode } = require('@msgpack/msgpack')
const character = require('./character.json')

const jsonString = JSON.stringify(character)
const characterEncoded = encode(character)
console.log('JSON Size: ', Buffer.byteLength(jsonString))
console.log('MsgPack Size: ', Buffer.byteLength(characterEncoded))

assert.deepStrictEqual(character, decode(characterEncoded))
fs.writeFileSync(path.join(__dirname, 'out', 'character-msgpack.dat'), characterEncoded)
