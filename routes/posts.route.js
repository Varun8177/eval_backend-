const express = require("express")
const Auth = require("../middlewares/Auth.middleware")
const PostModel = require("../models/post.model")
const postRouter = express.Router()
postRouter.use(Auth)

postRouter.get("/", async (req, res) => {
    const query = req.query
    const minComments = {}
    const maxComments = {}
    const device = {}
    if (query.device) {
        device["device"] = query.device
    }
    let page = 1
    if (query.page) {
        page = +query.page
    }
    const skipPosts = (page - 1) * 3
    if (query.min) {
        minComments.no_of_comments = { $gt: query.min }
    }
    if (query.max) {
        maxComments.no_of_comments = { $lt: query.max }
    }
    try {
        const posts = await PostModel.find({ $and: [{ userID: req.body.userID }, minComments, maxComments, device] }).skip(skipPosts).limit(3)
        res.send(posts)
    } catch (error) {
        res.send(error.message)
    }
})

postRouter.post("/add", async (req, res) => {
    try {
        if (req.body.title) {
            if (req.body.body) {
                if (req.body.device) {
                    if (req.body.no_of_comments) {
                        const post = new PostModel(req.body)
                        await post.save()
                        res.status(200).send({
                            message: "new post has been successfully added"
                        })
                    } else {
                        res.status(400).send({
                            message: "Please provide all details to create a post"
                        })
                    }
                } else {
                    res.status(400).send({
                        message: "Please provide all details to create a post"
                    })
                }
            } else {
                res.status(400).send({
                    message: "Please provide all details to create a post"
                })
            }
        } else {
            res.status(400).send({
                message: "Please provide all details to create a post"
            })
        }
    } catch (error) {
        res.send(error.message)
    }
})

postRouter.patch("/posts/update/:id", async (req, res) => {
    const id = req.params.id
    const changes = req.body
    try {
        await PostModel.findByIdAndUpdate({ _id: id }, changes)
        res.status(200).send({
            message: "post updated successfully"
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

postRouter.delete("/posts/delete/:id", async (req, res) => {
    const id = req.params.id
    const changes = req.body
    try {
        await PostModel.findByIdAndDelete({ _id: id })
        res.status(200).send({
            message: "post deleted successfully"
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})


postRouter.get("/top", async (req, res) => {
    try {
        const posts = await PostModel.find()
        let max = 0;
        let item = {}
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].no_of_comments > max) {
                max = posts[i].no_of_comments
                item = posts[i]
            }
        }
        res.status(200).send(item)
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

module.exports = postRouter