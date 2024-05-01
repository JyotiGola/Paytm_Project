
const express = require("express")
const userRouter = require("./user")
const accountRouter = require("./account")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

const router = express.Router()

router.use("/user", userRouter)
router.use("/account",accountRouter )

module.exports = router