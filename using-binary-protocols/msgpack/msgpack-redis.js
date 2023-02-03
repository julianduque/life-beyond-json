const Redis = require('ioredis')
const msgpack = require('@msgpack/msgpack')
const character = require('./character.json')

const redis = new Redis()
const sub = new Redis()

const start = async () => {
  const data = Buffer.from(msgpack.encode(character))
  await redis.setBuffer('character', data)

  const buffer = await redis.getBuffer('character')
  console.log(msgpack.decode(buffer))

  await sub.subscribe('my-channel')
  sub.on('messageBuffer', (topicBuffer, messageBuffer) => {
    const topic = topicBuffer.toString('utf8')
    if (topic === 'my-channel') {
      console.log(msgpack.decode(messageBuffer))
    }
  })

  setInterval(() => {
    const messageBuffer = Buffer.from(msgpack.encode({
      name: 'Baal',
      time: Date.now()
    }))
    redis.publishBuffer('my-channel', messageBuffer)
  }, 2000)
}

start()
