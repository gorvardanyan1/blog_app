import express from "express";
import User from "../Schemas/user.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { validatePassword, validateUsername } from "../validation/validation.js";

const sign = express.Router()

sign.post('/in', async (req, res) => {
    try {
        const { userName, password } = req.body
        const user = await User.findOne({ userName })
        let isCompare = await bcrypt.compare(password, user.password)
        if (isCompare) {
            const token = jwt.sign(
                { userId: user._id, userName: user.userName },
                process.env.JWT_SECRET,
                { expiresIn: '1d' } 
            );

            res.send({ token })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


})

sign.post('/up', async (req, res) => {
    try {
        const { firstName, lastName, userName, password } = req.body;
        if (validateUsername(userName).isValid && validatePassword(password).isValid) {
            let hashedPWD = await bcrypt.hash(password, 15)
            const newUser = new User({
                firstName,
                lastName,
                userName,
                password: hashedPWD
            })
            const savedUser = await newUser.save()
            res.redirect('/signIn.html')
        }
        else {
            res.redirect('/signUp.html')
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

export default sign