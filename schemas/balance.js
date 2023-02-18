const { model, Schema } = require('mongoose')

let balSchema = new Schema({
    UserID: String,
    Balance: Number,
    ClaimedDaily: Boolean
})

module.exports = model('balSchema', balSchema)