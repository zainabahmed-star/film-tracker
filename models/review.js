const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review