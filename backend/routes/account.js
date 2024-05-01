const mongoose = require("mongoose")
const express = require("express")
const zod = require("zod")
const { users, Accounts } = require("../db")
const { User } = require("./types");
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");
const { authMiddleware } = require("./middleware");
const router = express.Router();
router.use(express.json())
router.get("/balance", authMiddleware, async function (req, res) {
    if (!req.headers['content-length']) {
        req.headers['content-length'] = Buffer.byteLength(JSON.stringify(req.body), 'utf-8');
    }
    console.log(req.userId)
    const account = await Accounts.findOne({userId:req.userId})
    res.json({balance:account.balance})
     
})

router.post("/transfer", authMiddleware, async (req, res) => {
    if (!req.headers['content-length']) {
        req.headers['content-length'] = Buffer.byteLength(JSON.stringify(req.body), 'utf-8');
    }
    const session = await mongoose.startSession();

    session.startTransaction();
    const amount = req.body.amount;
    const to = req.body.to;

    // Fetch the accounts within the transaction
    const account = await Accounts.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Accounts.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Accounts.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Accounts.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});
module.exports = router;
