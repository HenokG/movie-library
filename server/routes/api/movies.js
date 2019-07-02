const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../auth");
const to = require("../../utils/to");
const socketApi = require("../../utils/socketApi");
const Movie = mongoose.model("Movie");
const Rate = mongoose.model("Rate");
const User = mongoose.model("User");

/**
 * GET all movies (+ average rating)
 */
router.get("/", auth.required, async (req, res, next) => {
  const [, movies] = await to(getMovies({ req: req, next: next }));
  return res.json(movies);
});

/**
 * GET shared movies (+ average rating)
 */
router.get("/shared", auth.required, async (req, res, next) => {
  const [, movies] = await to(
    getMovies({
      filter: { shared: { $exists: true } },
      req: req,
      next: next
    })
  );
  return res.json(movies);
});

/**
 * Add a movie
 */
router.post("/", auth.required, async (req, res, next) => {
  const movie = new Movie();

  movie.title = req.body.title;
  movie.releaseDate = req.body.releaseDate;
  movie.duration = req.body.duration;
  movie.actors = req.body.actors;

  const [err] = await to(movie.save());

  if (err) return next(err);

  // push notification to users for live feedback
  sendUpdateToUsers({
    messageToUsers: `${movie.title} has been Added!`,
    req,
    next
  });

  return res.status(200).json({
    message: "successfully inserted"
  });
});

/**
 * Update a movie
 */
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

  const [err, saved] = await to(movie.save());
  if (!saved) return next(err);

  // push notification to users for live feedback
  sendUpdateToUsers({
    messageToUsers: `${movie.title} has been Updated!`,
    req,
    next
  });

  res.status(200).json({
    message: "successfully updated"
  });
});

/**
 * DELETE a movie
 */
router.patch("/", auth.required, async (req, res, next) => {
  const [error, movie] = await to(Movie.findByIdAndDelete(req.body.id));
  if (!movie) return next(error);

  // push notification to users for live feedback
  sendUpdateToUsers({
    messageToUsers: `${movie.title} has been Deleted!`,
    req,
    next
  });

  res.status(200).json({
    message: "successfully removed"
  });
});

/**
 * share a movie
 */
router.post("/share", auth.required, async (req, res, next) => {
  const [error, movie] = await to(Movie.findById(req.body.id));
  if (!movie) return next(error);

  movie.shared = req.user.id;
  {
    const [error] = await to(movie.save());
    if (error) return next(error);

    // push notification to users for live feedback
    sendUpdateToUsers({
      messageToUsers: `${movie.title} has been Shared!`,
      req,
      next
    });

    res.status(200).json({ message: "successfully shared" });
  }
});

/**
 * rate a movie
 */
router.post("/rate", auth.required, async (req, res, next) => {
  const [error, movie] = await to(Movie.findById(req.body.id));
  if (!movie) return next(error);

  const rate = new Rate();
  rate.user = req.user.id;
  rate.movie = movie.id;
  rate.rating = req.body.rating;
  rate.comment = req.body.comment;
  // has user already rated this movie?
  {
    const [, alreadyRated] = await to(
      Rate.findOne({ user: rate.user, movie: rate.movie })
    );
    if (alreadyRated) return next({ message: "already rated this movie!" });
  }
  {
    const [error] = await to(rate.save());
    if (error) return next(error);

    // push notification to users for live feedback
    sendUpdateToUsers({
      messageToUsers: `${movie.title} has been Rated!`,
      req,
      next
    });

    res.status(200).json({ message: "successfully rated" });
  }
});

/**
 * calculate average of numbers
 * within given array
 *
 * @param {number[]} arrayOfNumbers
 * @return {number} average
 */
const average = arrayOfNumbers =>
  arrayOfNumbers.reduce((total, rating) => total + rating.rating, 0) /
  arrayOfNumbers.length;

/**
 * retreive movies list from database and filter
 * by given argument if any
 *
 * @param {object} filter
 * @returns {object[]} list of movies either filtered nor unfiltered
 */
const getMovies = async ({ filter, req, next }) => {
  const [error, movies] = await to(
    Movie.find(filter || {})
      .select("-ratings -__v")
      .lean()
      .exec()
  );
  if (!movies) return next(error);

  // for each movie, get reviews, check if previously rated, calculate average rating
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const [, ratings] = await to(Rate.find({ movie: movie._id }));

    [, movie.reviews] = await to(getReviewsOfAMovie({ ratings }));

    // already rated this movie?
    const alreadyRated = ratings.filter(rating => rating.user == req.user.id);
    if (alreadyRated.length > 0) movie.previouslyRated = true;

    movie.averageRating = average(ratings) || 0;
  }
  return new Promise((resolve, reject) => {
    resolve(movies);
  });
};

/**
 * get reviews for a specific movie
 * by going through each rating
 * for that movie
 *
 * @param {object} { ratings }
 * @returns {object[]} commulated reviews for a movie
 */
const getReviewsOfAMovie = async ({ ratings }) => {
  const reviews = [];
  for (let i = 0; i < ratings.length; i++) {
    const rating = ratings[i];
    const [, user] = await to(User.findById(rating.user));
    if (!user) continue;
    reviews.push({
      rating: rating.rating,
      comment: rating.comment,
      username: user.username
    });
  }
  return reviews;
};

/**
 * send update to users for a live feedback experience
 *
 * live feedback is provided both for users
 * on shared-movies page & all-movies page
 *
 * @param {object} { messageToUsers, req, next }, messageToUsers is a notification displayed on user devices
 */
const sendUpdateToUsers = async ({ messageToUsers, req, next }) => {
  const [, allMovies] = await to(getMovies({ req: req, next: next }));

  socketApi.sendForAllMovies({ message: messageToUsers, data: allMovies });

  // filter out shared movies
  const sharedMovies = allMovies.filter(movie => movie.shared);

  socketApi.sendForSharedMovies({
    message: messageToUsers,
    data: sharedMovies
  });
};

module.exports = router;
