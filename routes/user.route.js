const express = require("express")
const UserModel = require("../models/user.model")
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const { Register, Login } = require("../controllers/user.controllers")

userRouter.get("/", async (req, res) => {
    try {
        const users = await UserModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


userRouter.post("/register", Register)

userRouter.post("/login", Login)


module.exports = userRouter