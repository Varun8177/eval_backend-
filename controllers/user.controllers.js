const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Register = async (req, res) => {
    const { email, gender, password, age, city, is_married } = req.body
    try {
        const users = await UserModel.findOne({ email: req.body.email })
        if (users) {
            res.status(400).send({
                message: "User already exist, please login"
            })
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                const newUser = { email, gender, password: hash, age, city, is_married }
                const user = new UserModel(newUser)
                await user.save()
                res.status(200).send({
                    message: "Succesfully Registered a new user"
                })
            });
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id }, process.env.keyword);
                    res.status(200).send({
                        message: "Succesfully Logged in!!",
                        token
                    })
                } else {
                    res.status(400).send({
                        message: "wrong Password"
                    })
                }
            });
        } else {
            res.status(400).send({
                message: "User Not registered"
            })
        }
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = {
    Register,
    Login
}