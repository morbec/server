const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const router = express.Router()

// Bcrypt to encrypt passwords
const bcryptSalt = 10

// router.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
//     // failureFlash: true,
//     passReqToCallback: true,
//   }),
// )

// TODO: FIX Mongoose deprecated warnings

router.post('/login', passport.authenticate('local'), (req, res) => {
  // triggered after successful authenticate()
  req.login(req.user, (err) => {
    if (err)
      return res.status(500).json({
        message: 'Something went wrong in the authentication process',
      })
    return res.json(req.user)
  }),
    (error, req, res) => {
      // triggered after failed authenticate()
      return res.status(401).json(error)
    }
})

router.post('/signup', async (req, res) => {
  const { username, password, email, firstName, lastName, avatar, projects  } = req.body
  if (username === '' || password === '') {
    return res.status(422).json({ message: 'Indicate username and password' })
  }

  const registeredUser = await User.findOne({ username }, 'username')
  if (registeredUser !== null) {
    return res.status(409).json({ message: 'The username already exists' })
  }

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  const newUser = await User.create({
    username: username,
    password: hashPass,
    email: email,
    firstName: firstName,
    lastName:lastName,
    avatar: avatar,
    projects: projects 
  })
  req.login(newUser, () => {
    return res.status(200).json(newUser)
  })
})

router.post('/edit/:_id', async (req, res) => {
  const { _id } = req.params
  const { username, email, firstName, lastName, avatar, projects  } = req.body
  const updateUser = await User.findByIdAndUpdate(_id, { username, email, firstName, lastName, avatar, projects  }, { new: true })
  return res.status(200).json(updateUser)
})

const uploader = require('../config/cloudinary-setup')
router.post('/upload', uploader.single('image'), (req, res) => {
  // console.log(req.user)
  if (!req.file) {
    // next(new Error('No file uploaded'))
    return res.status(500).json({ message: 'No file uploaded' })
  }

  User.findByIdAndUpdate(req.user._id, { image: req.file.secure_url }, { new: true })
    .then((udpatedUser) => {
      return res.json(udpatedUser)
    })
    .catch((err) => {
      return res.status(500).json({ message: `Error updating user => ${err}` })
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.status(200).json({ message: 'User successfully logged out' })
})

router.get('/loggedin', (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user)
  return res.json(null)
})

module.exports = router
