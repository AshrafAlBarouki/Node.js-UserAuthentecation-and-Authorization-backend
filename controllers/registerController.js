const User = require("../model/User");
const bcrypt = require("bcrypt");

const registerHandler = async (req, res) => {
  const { user, email, pwd } = req.body;
  if (!user || !email || !pwd) {
    return res
      .status(400)
      .json({ message: "username, email and password are required!" });
  }
  //check for duplicate emails
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "Email already exists!" });
  }
  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(pwd, 10);
    // create and store the new user
    const result = await User.create({
      username: user,
      email: email,
      password: hashedPassword,
    });
    return res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerHandler };
