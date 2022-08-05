const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../models/user')

module.exports = {
    create,
    login,
    checkToken
}

async function create(req, res) {
    try {
        // creates and adds user to database
        const user = await User.create(req.body)
        // token created will be a string
        const token = createJWT(user)
        // Yes, we can use res.json to send back just a string
        // The client code needs to take this into consideration
        res.json(token)
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email })
        if(!user) throw new Error('Invalid Credentials')
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = createJWT(user)
            res.json(token)
        } else {
            throw new Error('Invalid Credentials')
        }
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
}

function checkToken(req, res) {
    console.log('req.user', req.user )
    res.json(req.exp)
}


/*-- Helper Functions --*/

function createJWT(user) {
    return jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn: '24h' }
    )
}
