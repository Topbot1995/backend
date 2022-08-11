const fastifyPlugin = require('fastify-plugin')
const fastifyJwt = require('fastify-jwt')
const { SECRET_KEY } = require('./config')

const jwtPlugin = async (fastify, opts, done) => {
    fastify.register(fastifyJwt, {
        secret: SECRET_KEY
    })
    fastify.decorate("authenticate", async (request, reply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
    done();
}

module.exports = fastifyPlugin(jwtPlugin)