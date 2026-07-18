const Movie = require('../models/movie')

const index = async (req, res) => {
    let allMovies = await Movie.find({})

    res.render('movies/index.ejs', {
        allMovies,
        user: req.session.user
    })
}

const showAddForm = (req, res) => {
    res.render('movies/new.ejs', {
        user: req.session.user
    })
}



module.exports = {
    index,
    showAddForm,
}