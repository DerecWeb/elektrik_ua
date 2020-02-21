const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    rate: {
        type: Number
    },
    length: {
        type: String
    },
    country: {
        type: String
    },
    link: {
        type: String
    },
    picture: {
        type: String
    },
    cinemas: {
        type: [String],
        default: []
    }
})

mongoose.model('Jobs', JobsSchema)
