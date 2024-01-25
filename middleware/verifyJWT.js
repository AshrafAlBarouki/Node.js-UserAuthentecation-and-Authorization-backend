const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // in case it was Auth with uppercase A
  if (!authHeader?.startsWith("Bearer")) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];// the Token index is 1 and the word Bearer is 0
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded.UserInfo.username; 
    req.roles = decoded.UserInfo.roles
    next();
  });
};

module.exports = verifyJWT;
