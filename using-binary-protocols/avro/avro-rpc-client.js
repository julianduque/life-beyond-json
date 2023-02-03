const fs = require('fs')
const net = require('net')
const path = require('path')
const avro = require('avsc')

const protocolFile = fs.readFileSync(path.join(__dirname, 'Tabletop.avdl'), 'utf8')
const protocol = avro.readProtocol(protocolFile)
const service = avro.Service.forProtocol(protocol)

const client = service.createClient({
  buffering: true,
  transport: net.connect(6000)
})

client.createCharacter('Baal', (err, result) => {
  if (err) throw err
  console.log(result)
})

client.rollDice(1, 20, (err, result) => {
  if (err) throw err
  console.log(result)
})
