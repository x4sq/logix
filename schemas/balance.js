const { model, Schema, mongoose } = require('mongoose')

let balSchema = new Schema({
    UserID: String,
    Balance: String,
    ClaimedDaily: Boolean
})

module.exports = model('balSchema', balSchema)