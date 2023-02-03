const fastify = require('fastify')({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
})
const msgpack = require('@msgpack/msgpack')
const character = require('./character.json')

// Using a Plugin for Serialization
fastify.register(require('@fastify/accepts-serializer'), {
  serializers: [
    {
      regex: /^application\/msgpack$/,
      serializer: body => Buffer.from(msgpack.encode(body))
    }
  ],
  default: 'application/json'
})

// Using Native for Content Type Decoding
fastify.addContentTypeParser('application/msgpack', {
  parseAs: 'buffer'
}, async (req, body, done) => {
  try {
    const res = msgpack.decode(body)
    return res
  } catch (err) {
    done(err)
  }
})

fastify.post('/decode', async (req, reply) => {
  const body = req.body
  fastify.log.info(body)
  return body
})

fastify.get('/encode', (req, reply) => {
  reply.send(character)
})

const start = async () => {
  try {
    await fastify.listen({ port: 8080 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
