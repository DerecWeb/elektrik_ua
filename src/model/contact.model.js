const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    telegram: {
        type: String,
        required: true
    }})

mongoose.model('contact', ContactSchema)