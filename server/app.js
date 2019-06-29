const createError = require("http-errors");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// bootstrap our express app
const app = express();

app.use(logger("dev"));
// use body-parser for parsing request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// enable cors for valid communication between our web-client(React) and our server(Express)
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost/mytvbox", {
  useNewUrlParser: true,
  useCreateIndex: true
});

require("./models/User");
require("./config/passport");
require("./models/Rate");
require("./models/Movie");

const usersRouter = require("./routes/api/users");
const moviesRouter = require("./routes/api/movies");

app.use("/users", usersRouter);
app.use("/movies", moviesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message
    }
  });
});

module.exports = app;
