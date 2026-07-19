const Movie = require('../models/movie')

const index = async (req, res) => {
    let allMovies = await Movie.find({})

    res.render('movies/index.ejs', {
        allMovies,
        user: req.session.user
    })
}

const showAddForm = async (req, res) => {
    res.render('movies/new.ejs', {
    })
}

const create = async (req, res) => {
    const movieData = {}

    movieData.title = req.body.title
    movieData.genre = req.body.genre 
    movieData.releaseYear = req.body.releaseYear
    movieData.posterURL = req.body.posterURL
    movieData.owner = req.session.user._id

    let createdMovie = await Movie.create(movieData)

    res.redirect('/movies')
}

module.exports = {
    index,
    showAddForm,
    create,
}