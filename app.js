const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")

const { API_VERSION } = require('./constants')

const app = express()

// Import routing
const authRoutes = require("./router/auth")
const userRoutes = require("./router/user")

//Configure body parse
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configure static folder
app.use(express.static("uploads"))

// Configure header htttp cors
app.use(cors())

// Configure routings
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, userRoutes)


module.exports = app