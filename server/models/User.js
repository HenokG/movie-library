const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const to = require("../utils/to");
const secret = require("../config").secret;

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      // match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      // match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    password: {
      type: String,
      required: [true, "can't be blank"]
    }
  },
  { timestamps: true }
);

UserSchema.methods.validPassword = async function(password) {
  const [error, isValid] = await to(bcrypt.compare(password, this.password));
  if (error || !isValid) return false;
  return true;
};

UserSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, 10);
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  const token = jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
  return token;
};

UserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    token: this.generateJWT()
  };
};

// UserSchema.methods.toProfileJSONFor = function(user) {
//   return {
//     username: this.username,
//     bio: this.bio,
//     image:
//       this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
//     following: user ? user.isFollowing(this._id) : false
//   };
// };

// UserSchema.methods.favorite = function(id) {
//   if (this.favorites.indexOf(id) === -1) {
//     this.favorites.push(id);
//   }

//   return this.save();
// };

// UserSchema.methods.unfavorite = function(id) {
//   this.favorites.remove(id);
//   return this.save();
// };

// UserSchema.methods.isFavorite = function(id) {
//   return this.favorites.some(function(favoriteId) {
//     return favoriteId.toString() === id.toString();
//   });
// };

// UserSchema.methods.follow = function(id) {
//   if (this.following.indexOf(id) === -1) {
//     this.following.push(id);
//   }

//   return this.save();
// };

// UserSchema.methods.unfollow = function(id) {
//   this.following.remove(id);
//   return this.save();
// };

// UserSchema.methods.isFollowing = function(id) {
//   return this.following.some(function(followId) {
//     return followId.toString() === id.toString();
//   });
// };

mongoose.model("User", UserSchema);
