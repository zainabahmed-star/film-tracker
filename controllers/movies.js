const Movie = require('../models/movie')
const cloudinary = require('../config/cloudinary.js')

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

    res.render('movies/show.ejs', {
        foundmovie,
        user: req.session.user
    })
}

module.exports = {
    index,
    showAddForm,
    create,
    show,
}