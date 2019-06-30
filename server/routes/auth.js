var jwt = require("express-jwt");
var secret = require("../config").secret;

/**
 * retrieve authentication token
 * from header
 *
 * @param {string} req
 * @return {string} token plucked from header
 */
const getTokenFromHeader = req => req.header("token");

var auth = {
  required: jwt({
    secret: secret,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
