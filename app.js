/* eslint-disable import/order */
require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cors = require('cors')

var Loggerr = require('loggerr')
const log = new Loggerr()

mongoose
  .connect('mongodb://localhost/tracker', { useNewUrlParser: true, useCreateIndex: true })
  .then((x) => {
    log.info('Connected to Mongo!', {
      database_name: `${x.connections[0].name}`,
    })
  })
  .catch((err) => {
    log.error(new Error(`Error connecting to mongo: ${err}`))
  })

const app_name = require('./package.json').name
// eslint-disable-next-line no-unused-vars
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()

// Middleware Setup
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// default value for title local
app.locals.title = 'Issues'

// Enable authentication using session + passport
app.use(
  session({
    secret: 'code or die',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }),
)
require('./passport')(app)

// CORS settings to allow cross-oring interacton
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)

const index = require('./routes/index')
app.use('/', index)

const auth = require('./routes/auth')
app.use('/api', auth)

const projects = require('./routes/projects')
app.use('/api', projects)

const issues = require('./routes/issues')
app.use('/api', issues)

const comments = require('./routes/comments')
app.use('/api', comments)

module.exports = app
