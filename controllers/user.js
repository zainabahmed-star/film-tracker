const User = require('../models/user')

const addWatchlist = async (req, res) => {
    const user = await User.findById(req.session.user._id)

    if (!user.watchlist.includes(req.params.id)){
          user.watchlist.push(req.params.id)
          await user.save()
    }
  

    res.redirect(`/movies/${req.params.id}`)
}

const showWatchlist = async (req, res) => {
    const user = await User.findById(req.session.user._id).populate('watchlist')

    res.render('users/watchlist.ejs', {
        movies: user.watchlist,
        user: req.session.user,
    })
}

const showWatched = async (req, res) => {
    const user = await User.findById(req.session.user._id).populate('watched')

    res.render('users/watched.ejs', {
        movies: user.watched,
        user: req.session.user,
    })
}

const addWatched = async (req, res) => {
    const user = await User.findById(req.session.user._id)

    if (!user.watched.includes(req.params.id)){
          user.watched.push(req.params.id)

           await user.save()
    }
  

    res.redirect(`/movies/${req.params.id}`)
}

const removeFromWatched = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.session.user._id, {
        $pull: { watched: req.params.id}
    })

    res.redirect('/watched')
}

const removeFromWatchlist = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.session.user._id, {
        $pull: { watchlist: req.params.id}
    })

    res.redirect('/watchlist')
}


module.exports = {
    addWatchlist,
    showWatchlist,
    showWatched,
    addWatched,
    removeFromWatched,
    removeFromWatchlist,
}