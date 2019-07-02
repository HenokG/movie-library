const createError = require("http-errors");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * enable CORS for valid communication between server and client
 */
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * connect to mongodb database named 'movie-library'
 */
mongoose.connect("mongodb://localhost/movie-library", {
  useNewUrlParser: true,
  useCreateIndex: true
});

require("./models/User");
require("./models/Movie");
require("./models/Rate");
require("./config/passport");

const usersRouter = require("./routes/api/users");
const moviesRouter = require("./routes/api/movies");

/**
 * setup router
 */
app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);

/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(err.status || 400);

  res.json({
    errors: {
      message: err.message
    }
  });
});

module.exports = app;
