const User = require('../models/user')
const bcrypt = require('bcrypt')

const showSignUpForm = (req, res) => {
    res.render('auth/sign-up.ejs', {
        user: req.session.user,
        error: null,
    })
}

const signUp = async (req, res) => {
    const userInDatabase = await User.findOne({
        username: req.body.username
    })

    if (userInDatabase) {
        return res.render('auth/sign-up.ejs', {
            error: 'Username already taken.',
            user: req.session.user
        })
    }

    if (req.body.password.length < 6) {
         return res.render('auth/sign-up.ejs', {
            error: 'Password must be at least 6 characters long.',
            user: req.session.user
        })
    }

    if (req.body.password !== req.body.confirmPassword){
        return res.render('auth/sign-up.ejs', {
            error: 'Password and confirm password must match!',
            user: req.session.user
        })
    }

    let userData = {}
    userData.username = req.body.username

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    userData.password = hashedPassword

    const user = await User.create(userData)

    req.session.user = {
        username: user.username,
        _id: user._id
    }
    req.session.save(() => {
        res.redirect('/auth/sign-in')
    })
}

const showSignInForm = (req, res) => {
    res.render('auth/sign-in.ejs', {
        user: req.session.user
    })
}

const signIn = async (req, res) => {
    const userInDatabase = await User.findOne({
        username: req.body.username
    })

    if (!userInDatabase) {
        return res.send('User does not exist.')
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)

    if(!validPassword) {
        return res.send('Login failed. Please try again.')
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
       
    }
    req.session.save(() => {
        res.redirect('/movies')
    })
}

const signOut = async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

module.exports = {
    showSignUpForm,
    signUp,
    showSignInForm,
    signIn,
    signOut,
}