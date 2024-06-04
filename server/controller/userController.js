const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create a user");
  }
});

const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.picture,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

const searchUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            //$or operator is used to match documents that satisfy at least one of the specified conditions.
            { name: { $regex: req.query.search, $options: "i" } }, // This condition matches documents where the name field contains the search keyword, case-insensitively 
            { email: { $regex: req.query.search, $options: "i" } }, //similar as above but for email
          ],
        }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });  //This find({ _id: { $ne: req.user._id } }) is used to exclude the logged in users 
    res.send(users);
  } catch (error) {
    res.status(500).json({ error: "Some error occured" });
  }
};

module.exports = { registerUser, authUser, searchUser };
