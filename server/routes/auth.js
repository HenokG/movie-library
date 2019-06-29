var jwt = require("express-jwt");
var secret = require("../config").secret;

function getTokenFromHeader(req) {
  return req.header("token");
}

var auth = {
  required: jwt({
    secret: secret,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
