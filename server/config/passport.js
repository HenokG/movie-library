var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
const to = require("../utils/to");
var User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      const [error, user] = await to(User.findOne({ email: email }));
      if (error || !user) return done(error);

      {
        const [error, doesPasswordMatch] = await to(
          user.validPassword(password)
        );
        if (error || !doesPasswordMatch)
          return done(null, false, { message: "invalid credentials." });
      }

      return done(null, user);
    }
  )
);
