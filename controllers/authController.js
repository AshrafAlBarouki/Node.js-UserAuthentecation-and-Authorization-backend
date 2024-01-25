const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginHandler = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd) {
    return res
      .status(400)
      .json({ message: "email and password are required!" });
  }
  const userExists = await User.findOne({ email: email }).exec();
  if (!userExists) {
    return res.sendStatus(401); // Unauthorized
  }
  // check password
  const match = await bcrypt.compare(pwd, userExists.password);
  if (match) {
    const roles = Object.values(userExists.roles).filter(Boolean);
    // create JWTs
    const payload = {
      UserInfo: { username: userExists.username, roles: roles },
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    // saving refresh token with current user
    userExists.refreshToken = refreshToken;
    const result = await userExists.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken , roles});
  } else {
    res.sendStatus(401);
  }
};

module.exports = { loginHandler };
