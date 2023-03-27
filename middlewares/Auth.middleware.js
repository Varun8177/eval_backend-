const jwt = require("jsonwebtoken")
require("dotenv").config()

const Auth = (req, res, next) => {
    const token = req.headers.authtoken.split(" ")[1]
    jwt.verify(token, process.env.keyword, (err, decoded) => {
        if (err) {
            res.send({
                message: err.message
            })
        } else {
            req.body.userID = decoded.userID
            next()
        }
    });
}

module.exports = Auth
