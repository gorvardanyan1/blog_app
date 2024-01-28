import express from 'express'
import { authenticateJWT } from '../jwt/jwt.js'
import User from '../Schemas/user.js'

const user = express.Router()


user.get('/', authenticateJWT, async (req, res) => {
    try {
        const { userId } = req.user;
        console.log(req.user);
        const user = await User.findById(userId)
        res.send(user)
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default user