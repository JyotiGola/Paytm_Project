const mongoose = require("mongoose")

mongoose.connect("your mongodb instance url")

const UserSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    amount: [{type:mongoose.Schema.Types.ObjectId, ref:"Bank"}]
})

const AccountSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"users"},
    balance: Number
})

const users = mongoose.model("user", UserSchema)
const Accounts = mongoose.model("Accounts", AccountSchema)

module.exports = {
    users, Accounts
}
