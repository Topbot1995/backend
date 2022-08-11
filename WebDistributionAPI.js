const moment = require('moment')
const ObjectId = require('mongodb').ObjectId;
const {API_ENDPOINT, API_KEY, SECRET_KEY} = require('./config')
module.exports = routes = async (fastify, options) => {

    const collection = fastify.mongo.db.collection("api_data")    

    fastify.post('/:url', async (request, reply) => {
        
        const url = request.url;                
        const option = {
            method: "POST",
            contentType: "application/json", 
            headers: {
                'X-Api-Key': API_KEY,
                'X-App-Id': '5'
            },            
          } 
        const result = await fastify.curl(`${API_ENDPOINT}${url}`, option)
        if(result.res.status === 403) {
            return reply.header('Content-Type', 'text/html; charset=utf-8').send(result.res.data)
        } else {
            return reply.header('Content-Type', 'application/json; charset=utf-8').send(result.res.data)
        }
        
    })

}