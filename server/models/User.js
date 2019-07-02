const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const to = require("../utils/to");
const secret = require("../config").secret;
/**
 * Represent a User
 */
var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    password: {
      type: String,
      required: [true, "can't be blank"]
    }
  },
  { timestamps: true }
);

/**
 * validate given password against password stored in current
 * user object using bcrypt's compare function
 * @param {string} password
 * @returns {boolean} validating if a match is detected
 */
UserSchema.methods.validPassword = async function(password) {
  const [error, isValid] = await to(bcrypt.compare(password, this.password));
  if (error || !isValid) return false;
  return true;
};

/**
 * set password to current user object after
 * encrypting it with bcrypt
 *
 * @param {string} password
 */
UserSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, 10);
};

/**
 * generate json web token for
 * current user object
 *
 * @returns {string} signed token
 */
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

/**
 * convert user object's selected properties to
 * authentication json
 *
 * @returns {object} containing signed token and username
 */
UserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    token: this.generateJWT()
  };
};
/**
 * register User model
 */
mongoose.model("User", UserSchema);
