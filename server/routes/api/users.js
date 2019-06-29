const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const to = require("../../utils/to");
const User = mongoose.model("User");

/* signup user. */
router.post("/signup", async (req, res, next) => {
  const user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  await to(user.setPassword(req.body.password));
  // save user
  const [error] = await to(user.save());
  if (error) return next(error);

  return res.status(200).json({ message: "registration successful" });
});

// login user
router.post("/login", async (req, res, next) => {
  if (!req.body.email) {
    return res.status(422).json({ message: "email can't be blank" });
  }

  if (!req.body.password) {
    return res.status(422).json({ message: "password can't be blank" });
  }

  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json(user.toAuthJSON());
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

module.exports = router;
