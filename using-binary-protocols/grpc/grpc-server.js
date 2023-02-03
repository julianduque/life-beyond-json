const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'Tabletop.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    arrays: true
  }
)
const packageObject = grpc.loadPackageDefinition(packageDefinition)
const tabletop = packageObject.Tabletop

function roll (number, sides) {
  return number * (1 + Math.floor(Math.random() * sides));
}

function rollDice (call, callback) {
  const number = call.request.number;
  const sides = call.request.sides;

  callback(null, { result: roll(number, sides) });
}

function createCharacter (call, callback) {
  const name = call.request.name;
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
const start = () => {
  const server = new grpc.Server()
  server.addService(tabletop.service, {
    rollDice,
    createCharacter
  })

  server.bindAsync('0.0.0.0:6001', grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) throw err
    server.start()
  })
}

start()
