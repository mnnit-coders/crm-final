const express = require('express');
const createError = require('http-errors')
const app = express();
const connectDB = require('./utils/connectDB')
require('dotenv').config()

connectDB();

// Middlewares
app.use(require('cors')())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(require('morgan')('dev'))
app.use(require('cookie-parser')())

// Routes
app.use('/api', require('./routes'))


// Error Handling
app.use(async(req, res, next) => {
    next(createError.NotFound("This route does not exist"))
})

app.use((err, req, res, next) => {
    // console.log(err)
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

// Server Listening
app.listen(process.env.PORT || 5000 , () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`)
}) 