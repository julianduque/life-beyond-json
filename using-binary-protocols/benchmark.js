'use strict'

const fs = require('fs')
const net = require('net')
const path = require('path')
const avro = require('avsc')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const { Suite } = require('benchmark')

// Avro
const protocolFile = fs.readFileSync(
  path.join(__dirname, 'avro', 'Tabletop.avdl'),
  'utf8'
)
const protocol = avro.readProtocol(protocolFile)
const service = avro.Service.forProtocol(protocol)

const avroClient = service.createClient({
  buffering: true,
  transport: net.connect(6000)
})

// GRPC
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'grpc', 'Tabletop.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    arrays: true
  }
)
const packageObject = grpc.loadPackageDefinition(packageDefinition)
const grpcClient = new packageObject.Tabletop('localhost:6001', grpc.credentials.createInsecure())

const rollDiceBench = new Suite()
const createCharacterBench = new Suite()

const payloadCharacter = { name: 'Baal' }
const payloadDice = { number: 1, sides: 20  }
const BENCH = process.env.BENCH || 'send'

function runRollDice () {
  rollDiceBench
    .add('avro#rollDice', {
      defer: true,
      fn: async function (deferred) {
        avroClient.rollDice(1, 20, (err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .add('grpc#rollDice', {
      defer: true,
      fn: async function (deferred) {
        grpcClient.rollDice(payloadDice, (err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .on('error', function (err) {
      console.log(err)
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
      process.exit(0)
    }).run({ async: true })
}

function runCreateCharacter () {
  createCharacterBench
    .add('avro#createCharacter', {
      defer: true,
      fn: async function (deferred) {
        avroClient.createCharacter('Baal', (err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .add('grpc#createCharacter', {
      defer: true,
      fn: async function (deferred) {
        grpcClient.createCharacter(payloadCharacter, (err, result) => {
          if (err) throw err
          deferred.resolve()
        })
      }
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .on('error', function (err) {
      console.log(err)
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
      process.exit(0)
    }).run({ async: true })
}

switch (BENCH) {
  case 'dice':
    runRollDice()
    break
  case 'character':
    runCreateCharacter()
    break
  default: runRollDice()
}
