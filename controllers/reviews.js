const Review = require('../models/review')
const Movie = require('../models/movie')

const showForm = async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    res.render('reviews/show.ejs', {
        movie,
        user: req.session.user
    })
}



const create = async (req, res) => {
    const reviewData = {
        movie: req.params.id,
        user: req.session.user._id,
        rating: req.body.rating,
        text: req.body.text,
    }

    await Review.create(reviewData)

    res.redirect(`/movies/${req.params.id}`)
}




module.exports = {
    showForm,
    create,
}