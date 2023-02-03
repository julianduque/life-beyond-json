const fs = require('fs')
const path = require('path')
const assert = require('assert')
const protobufjs = require('protobufjs')
const character = require('./character.json')

const main = async () => {
  const root = await protobufjs.load(path.join(__dirname, 'schema', 'Character.proto'))
  const Character = root.lookupType('Character')
  const err = Character.verify(character)
  if (err) throw err

  const message = Character.create(character)
  const buffer = Character.encode(message).finish()

  console.log('JSON Size: ', Buffer.byteLength(JSON.stringify(character)))
  console.log('Protobuf Size: ', Buffer.byteLength(buffer))

  const decodeMsg = Character.decode(buffer)
  const obj = Character.toObject(decodeMsg)

  assert.deepStrictEqual(character, obj)
  fs.writeFileSync(path.join(__dirname, 'out', 'character-protobuf.dat'), buffer)
}

main().catch((err) => console.error(err))
