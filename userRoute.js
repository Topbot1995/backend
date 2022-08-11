const moment = require('moment')
const ObjectId = require('mongodb').ObjectId;
module.exports = routes = async (fastify, options) => {

    const collection = fastify.mongo.db.collection("users")
    const transcollection = fastify.mongo.db.collection("transactions")

    fastify.get('/user/all', async (request, reply) => {
        const result = await collection.find({}).toArray()
        if (result.length == 0) {
            throw new Error('No documents found')
        }
        return result
    })

    fastify.post('/user/transaction/:id', async (request, reply) => {

        const { id } = request.params;
        const result = await transcollection.find({ user_id: ObjectId(id) }).toArray()
        if (!result) {
            throw new Error('Invalid value')
        }
        console.log(result)
        return result
    })

    const userBodyJsonSchema = {
        type: "object",
        required: ['email', 'password'],
        properties: {
            firstname: { type: "string" },
            lastname: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" }
        },
    }

    const schema = {
        body: userBodyJsonSchema
    }

    // btc_wallet: password.current.value,
    // eth_wallet: eth_wallet.current.value,
    // crt_wallet: crt_wallet.current.value,
    // ltc_wallet: ltc_wallet.current.value,
    // bch_wallet: bch_wallet.current.value,
    // dash_wallet: dash_wallet.current.value,
    // doge_wallet: doge_wallet.current.value,
    // zcash_wallet: zcash_wallet.current.value,
    // monero_wallet: monero_wallet.current.value,
    // etc_wallet: etc_wallet.current.value,

    fastify.post('/sign-up', { schema }, async (request, reply) => {

        const { firstname, lastname, username, email, password } = request.body

        const oldOne = await collection.findOne({ email: email })
        if (oldOne) {
            throw new Error('Signup-Error: account already exists')
        }

        const result = await collection.insertOne({ firstname, lastname, username, email, password })
        const token = fastify.jwt.sign({ "id": result.insertedId, "email": email, "username": username  })
        return reply.send({ token });
    })

    fastify.post('/update-profile/:id', async (request, reply) => {

        const { id } = request.params;
        const { firstname, lastname, username, email, password, btc_wallet, eth_wallet, crt_wallet, ltc_wallet, bch_wallet, dash_wallet, doge_wallet, zcash_wallet, monero_wallet, etc_wallet } = request.body

        const oldOne = await collection.findOne({ _id: ObjectId(id) })
        if (!oldOne) {
            throw new Error('update-profile: account not exist')
        }

        const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: { firstname, lastname, username, email, password, btc_wallet, eth_wallet, crt_wallet, ltc_wallet, bch_wallet, dash_wallet, doge_wallet, zcash_wallet, monero_wallet, etc_wallet } })

        return reply.send({ success: true });
    })

    fastify.post('/user/profile/:id', async (request, reply) => {

        const { id } = request.params;
        console.log(id)

        const oldOne = await collection.findOne({ _id: ObjectId(id) })
        if (!oldOne) {
            throw new Error('Profile-Error: profile not found')
        }

        return reply.send(oldOne);
    })

    fastify.post('/sign-in', { schema }, async (request, reply) => {

        const { email, password } = request.body

        const result = await collection.findOne({ email: email })
        if (!result) {
            throw new Error("ERROR-Login: No user with that credential found!")

        }
        console.log(result._id);
        if (result.password != password) {
            throw new Error("ERROR-Login: Password not matched!")
        }
        const token = fastify.jwt.sign({ "id": result._id, "email": email, "username": result.username })
        console.log(token)
        reply.send({ token })
    })

    fastify.post('/verify-token', async (request, reply) => {

        try {
            await request.jwtVerify()
            reply.send({ login: "success" })

        } catch (err) {
            throw new Error('Error: Invalid Authentication Token')
        }

    })

    fastify.post('/user/create-order', async (request, reply) => {

        const { email, payType, payAmount } = request.body;

        const user = await collection.findOne({ email: email })

        if (!user) {
            throw new Error('Invalid user')
        }

        const result = await transcollection.insertOne({ user_id: user._id, payType, payAmount, confirmed: false, active: false, created_at: moment().format('YYYY-MM-D h:mm:s'), confirmed_at: null, status: true, power: 660.07 })

        if (!result) {
            throw new Error('Invalid transaction')
        }

        return reply.send({ ordered: "success", id: result.insertedId })
    })

    fastify.post('/transaction/confirm/:id', async (request, reply) => {
        const { id } = request.params;

        const result = await transcollection.updateOne({ "_id": ObjectId(id) }, { $set: { confirmed: true, confirmed_at: moment().format('YYYY-MM-D h:mm:s') } })
        console.log(result)
        if (!result) {
            throw new Error('TR-Update: Database Error')
        }
        return result
    })

    fastify.get('/transaction/:id', async (request, reply) => {
        const { id } = request.params;

        const result = await transcollection.findOne({ "_id": ObjectId(id) })
        console.log(result)
        if (!result) {
            throw new Error('Invalid value')
        }
        return result
    })


}