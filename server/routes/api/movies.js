const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../auth");
const to = require("../../utils/to");
const Movie = mongoose.model("Movie");
const Rate = mongoose.model("Rate");

// GET all movies
router.get("/", auth.required, async (req, res, next) => {
  const [error, movies] = await to(
    Movie.find({})
      .select("-ratings -__v")
      .lean()
      .exec()
  );
  if (!movies) return next(error);

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const [err, ratings] = await to(
      Rate.find({ movie: movie._id })
        .select("rating -_id")
        .lean()
        .exec()
    );
    // return res.json(ratings);
    movie.averageRating = average(ratings) || 0;
  }
  return res.json(movies);
});

// add a movie
router.post("/", auth.required, async (req, res, next) => {
  const movie = new Movie();

  movie.title = req.body.title;
  movie.releaseDate = req.body.releaseDate;
  movie.duration = req.body.duration;
  movie.actors = req.body.actors;

  const [err] = await to(movie.save());

  if (err) return next(err);
  return res.status(200).json({ message: "successfully inserted" });
});

// update a movie
router.put("/", auth.required, async (req, res, next) => {
  const [error, movie] = await to(Movie.findById(req.body.id));
  if (!movie) return next(error);

  if (req.body.title) {
    movie.title = req.body.title;
  }
  if (req.body.releaseDate) {
    movie.releaseDate = req.body.releaseDate;
  }
  if (req.body.duration) {
    movie.duration = req.body.duration;
  }
  if (req.body.actors) {
    movie.actors = req.body.actors;
  }
  movie.save();

  res.status(200).json({ message: "successfully updated" });
});

// DELETE a movie
router.delete("/", auth.required, async (req, res, next) => {
  const [error, movie] = await to(Movie.findByIdAndDelete(req.body.id));
  if (!movie) return next(error);

  res.status(200).json({ message: "successfully removed" });
});

// rate a movie
router.post("/rate", auth.required, async (req, res, next) => {
  const [error, movie] = await to(Movie.findById(req.body.id));
  if (!movie) return next(error);

  const rate = new Rate();
  rate.user = req.user.id;
  rate.movie = movie.id;
  rate.rating = req.body.rating;
  rate.comment = req.body.comment;
  // check if user has already rated this movie
  {
    const [error, previousRate] = await to(
      Rate.findOne({ user: rate.user, movie: rate.movie })
    );
    if (previousRate) return next({ message: "already rated this movie!" });
  }
  {
    const [error] = await to(rate.save());
    if (error) return next(error);

    res.status(200).json({ message: "successfully rated" });
  }
});

// returns average of numbers listed in the first parameter(which is an array)
const average = arrayOfNumbers =>
  arrayOfNumbers.reduce((total, rating) => total + rating.rating, 0) /
  arrayOfNumbers.length;

module.exports = router;
