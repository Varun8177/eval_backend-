const express = require("express")
const cors = require("cors")
const connection = require("./config/db")
const userRouter = require("./routes/user.route")
const postRouter = require("./routes/posts.route")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send({
        messge: "Home Page"
    })
})

app.use("/users", userRouter)
app.use("/posts", postRouter)
app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("connected to database")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`Server running at port ${process.env.port}`)
})