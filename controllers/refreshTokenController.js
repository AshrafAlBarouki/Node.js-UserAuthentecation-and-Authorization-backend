const User = require("../model/User");
const jwt = require("jsonwebtoken");

const refreshTokenHandler = async (req, res) => {
  const cookies = req.cookies;
  const { email, pwd } = req.body;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;

  const userExists = await User.findOne({ refreshToken:refreshToken }).exec();
  if (!userExists) {
    return res.sendStatus(403); // Forbidden
  }
  // check jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userExists.username !== decoded.UserInfo.username) {
      return res.sendStatus(403);
    }
    const roles = Object.values(userExists.roles);
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.UserInfo.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    res.json({ accessToken });
  });
};

module.exports = { refreshTokenHandler };
