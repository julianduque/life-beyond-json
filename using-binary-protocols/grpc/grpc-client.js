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
const tabletop = new packageObject.Tabletop('localhost:6001', grpc.credentials.createInsecure())

tabletop.rollDice({ number: 1, sides: 20 }, (err, result) => {
  if (err) throw err;
  console.log(result);
})

tabletop.createCharacter({ name: 'Baal' }, (err, result) => {
  if (err) throw err;
  console.log(result);
})