const fastifyPlugin = require('fastify-plugin')

const corsPlugin = async (fastify, opts, done) => {
    fastify.register(require("fastify-cors"), {
        origin: "*",
        methods: ["GET", "POST"]
    });
    done()
}

module.exports = fastifyPlugin(corsPlugin)