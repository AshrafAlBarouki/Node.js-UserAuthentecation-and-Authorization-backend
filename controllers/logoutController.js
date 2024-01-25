const User = require("../model/User");

const logoutHandler = async (req, res) => {
  //  On clinet, also delete the accessToken
  const cookies = req.cookies;
  const { email, pwd } = req.body;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // No content
  }
  const refreshToken = cookies.jwt;
  // Is refreshToken in DB?
  const userExists = await User.findOne({ refreshToken }).exec();
  if (!userExists) {
    res.clearCookie("jwt", { httpOnly: true});
    return res.sendStatus(204); //  No content
  }
  // Delete the refreshToken in db
  userExists.refreshToken = ' ';
  const result = await userExists.save();

  res.clearCookie("jwt", { httpOnly: true,});
  res.sendStatus(204);
};
// sameSite: "None", secure: true 
module.exports = { logoutHandler };
