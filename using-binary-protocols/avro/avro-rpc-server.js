const fs = require('fs')
const net = require('net')
const path = require('path')
const avro = require('avsc')

const protocolFile = fs.readFileSync(path.join(__dirname, 'Tabletop.avdl'), 'utf8')
const protocol = avro.readProtocol(protocolFile)

const server = avro.Service.forProtocol(protocol)
  .createServer()
  .onRollDice(rollDice)
  .onCreateCharacter(createCharacter)

function roll (number, sides) {
  return number * (1 + Math.floor(Math.random() * sides));
}

function rollDice (number, sides, callback) {
  callback(null, roll(number, sides));
}

function createCharacter (name, callback) {
  const character = {
    name,
    attributes: {
      strength: roll(3, 6),
      dexterity: roll(3, 6),
      constitution: roll(3, 6),
      intelligence: roll(3, 6),
      wisdom: roll(3, 6),
      charisma: roll(3, 6)
    }
  }
  callback(null, character);
}

net.createServer()
  .on('connection', conn => server.createChannel(conn))
  .listen(6000)
