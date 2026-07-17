const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    }, 
    releaseYear: {
        type: Number,
        required: true,
    }, 
    posterURL: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true })

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie