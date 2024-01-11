const express = require('express');
const router = express.Router();
const { Users } = require('../models')
const bcrypt = require('bcrypt')

const { validateToken } = require('../middlewares/AuthMiddleware')
const { sign } = require('jsonwebtoken')

router.get('/', async (req, res) => {
    const listOfPosts = await Posts.findAll()

    res.json(listOfPosts)
});

router.post("/", async (req, res) => {

    const { username, password } = req.body

    bcrypt.hash(password, 10).then((hash) => {

        Users.create({
            username: username,
            password: hash,
        })

        res.json("Success")
    })


})

router.post('/login', async (req, res) => {

    const { username, password } = req.body

    const user = await Users.findOne({
        where: {
            username: username,
        }
    })

    if (!user) res.json({ error: "User doesn't exist" })

    else {
        bcrypt.compare(password, user.password).then((match) => {

            if (!match) res.json({ error: "Wrong username/password combination" })

            else {
                const accessToken = sign({username: user.username, id: user.id }, "importantsecret")
                res.json({token: accessToken, username: user.username, id: user.id})
            }

        })

    }
})

router.get('/validate', validateToken, (req,res) => {
    res.json(req.user)
})


module.exports = router;
