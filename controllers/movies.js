const Movie = require('../models/movie')
const cloudinary = require('../config/cloudinary.js')
const Review = require('../models/review')
const User = require('../models/user.js')


const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'film-tracker/movies',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

const index = async (req, res) => {
    let allMovies = await Movie.find({}).populate('owner')

    res.render('movies/index.ejs', {
        allMovies,
        user: req.session.user
    })
}

const showAddForm = async (req, res) => {
    res.render('movies/new.ejs', {
        user: req.session.user
    })
}

const create = async (req, res) => {
    try {
    if (!req.file) {
      return res.render('error.ejs', {
        msg: 'Please select an image.',
      }) 
    }

    const uploadedImage = await uploadImage(req.file.buffer)
    
    const movieData = {
        title: req.body.title,
        genre: req.body.genre,
        releaseYear: req.body.releaseYear,
        image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        },
        owner: req.session.user._id
    }

    await Movie.create(movieData)
    
    res.redirect('/movies')
  } catch (error) {
    console.error(error)

    res.render('error.ejs', {
      msg: 'The movie could not be created.',
    })
  }

}


const show = async (req, res) => {
    const foundmovie = await Movie.findById(req.params.id).populate('owner')
    const foundreview = await Review.find({ movie: req.params.id }).populate('user')


    // use the User model... see if .some(movie) is in watchlist array on model

    let inWatchlist = false

    let inWatched= false

    if (req.session.user){
      const founduser = await User.findById(req.session.user._id)

    const inWatchlist = founduser.watchlist.some((item) => {
      return item.equals(foundmovie._id)
    })

    const inWatched = founduser.watched.some((item) => {
      return item.equals(foundmovie._id)
    })
    }

    res.render('movies/show.ejs', {
        foundmovie,
        foundreview,
        user: req.session.user,
        inWatchlist,
        inWatched,
    })
}

const edit = async (req, res) => {
    const foundmovie = await Movie.findById(req.params.id)

   

    res.render('movies/edit.ejs', {
        foundmovie,
        user: req.session.user
    })
}

const update = async(req,res)=>{
    const foundmovie = await Movie.findById(req.params.id)

    let movieData = {}

    movieData.title = req.body.title
    movieData.genre = req.body.genre
    movieData.releaseYear = req.body.releaseYear
    
    if (req.file) {
        const uploadedImage = await uploadImage(req.file.buffer)
        movieData.image = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.publicId,
        }
    }

    await Movie.findByIdAndUpdate(req.params.id, movieData)
    res.redirect(`/movies/${req.params.id}`)
}

const deleteMovie = async (req, res) => {
    const foundmovie = await Movie.findById(req.params.id)

    await foundmovie.deleteOne()
    res.redirect('/movies')
}

const confirmDelete = async (req, res) => {
  const foundmovie = await Movie.findById(req.params.id)

  res.render('movies/delete-confirm.ejs', {
        foundmovie,
        user: req.session.user
    })
}

module.exports = {
    index,
    showAddForm,
    create,
    show,
    edit,
    update,
    deleteMovie,
    confirmDelete,
}