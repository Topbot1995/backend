const Fastify = require("fastify")
const userRoute = require('./userRoute')
const WebDistributionAPI = require('./WebDistributionAPI')
const dbConnector = require('./dbConnector')
//const jwtPlugin = require('./jwtPlugin')
const corsPlugin = require("./corsPlugin")
const curlPlugin = require("./curlPlugin")

const fastify = Fastify({
  logger: true
})

const curlConfig = {

}

fastify.register(dbConnector)

fastify.register(curlPlugin)

fastify.register(corsPlugin)

//fastify.register(jwtPlugin)

fastify.register(WebDistributionAPI)

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
