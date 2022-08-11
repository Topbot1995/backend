const fastifyPlugin = require('fastify-plugin')
const fastifyMongodb = require('@fastify/mongodb')

const dbConnector = async (fastify, options) => {
    fastify.register(fastifyMongodb, {
        forceClose: true,
        url: "mongodb+srv://nakamurashyoiku:nakamura1995@cluster0.ydm61ka.mongodb.net/workingsite"
    })    
}

module.exports = fastifyPlugin(dbConnector)