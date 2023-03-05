const { model, Schema, mongoose } = require('mongoose')

let balSchemaTEST = new Schema({
    UserID: String,
    Balance: String,
    ClaimedDaily: Boolean
})

module.exports = model('balSchemaTest', balSchemaTEST)