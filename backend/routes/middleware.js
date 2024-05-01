const JWT_SECRET  = require("../config")
const jwt = require("jsonwebtoken") 

const authMiddleware=(req, res, next) =>{
    const authHeader = req.headers.authorization
    console.log("entering the middleware")
    if (! req.headers.authorization|| !req.headers.authorization.startsWith('Bearer')) {
               return res.status(403).json({})
    }
    const token = req.headers.authorization.split(' ')[1];
console.log(token)
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        
        req.userId = decoded.userId
        console.log(req.userId)
        console.log("exiting the middleware")
            next()

        
    }
    catch (err) {
        return res.status(403).json({})
    }
}
module.exports = {
        authMiddleware
    }
