const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session')
const { MongoStore } = require('connect-mongo')
const upload = require('./config/multer.js')
const path = require('path')

const isSignedin = require('./middleware/is-signed-in')

const authCtrl = require('./controllers/auth')
const moviesCtrl = require('./controllers/movies')
const reviewsCtrl = require('./controllers/reviews')
const usersCtrl = require('./controllers/user.js')


// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static(path.join(__dirname, "public")))
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))

app.get('/', (req, res) => {
    res.render('home.ejs', {
        user: req.session.user,
    })
})

// auth routers
app.get('/auth/sign-up', authCtrl.showSignUpForm )
app.post('/auth/sign-up', authCtrl.signUp)
app.get('/auth/sign-in', authCtrl.showSignInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.delete('/auth/sign-out', authCtrl.signOut)

//movies routers
app.get('/movies', moviesCtrl.index)
app.get('/movies/new', isSignedin, moviesCtrl.showAddForm)
app.post('/movies', isSignedin, upload.single('image'), moviesCtrl.create)
app.get('/movies/:id', moviesCtrl.show)
app.get('/movies/:id/edit', isSignedin, moviesCtrl.edit)
app.put('/movies/:id', isSignedin, upload.single('image'),  moviesCtrl.update)
app.delete('/movies/:id', isSignedin, moviesCtrl.deleteMovie)

//review routers
app.get('/movies/:id/reviews/new', reviewsCtrl.showForm)
app.post('/movies/:id/reviews', isSignedin, reviewsCtrl.create )
app.get('/movies/:id/reviews/:reviewId/edit', isSignedin, reviewsCtrl.showEditForm)
app.put('/movies/:id/reviews/:reviewId', isSignedin, reviewsCtrl.update)
app.delete('/movies/:id/reviews/:reviewId', isSignedin, reviewsCtrl.deleteReview)

//user routers
app.post('/watchlist/:id', isSignedin, usersCtrl.addWatchlist)
app.get('/watchlist', isSignedin, usersCtrl.showWatchlist)
app.get('/watched', isSignedin, usersCtrl.showWatched)
app.post('/watched/:id', isSignedin, usersCtrl.addWatched)
app.delete('/watched/:id', isSignedin, usersCtrl.removeFromWatched)

app.get('/dashboard', async (req, res) => {
    if (!req.session.user){
        return res.redirect('/auth/sign-in')
    }
    res.render('dashboard.ejs', {
        user: req.session.user
    })
})




app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
