import userModel from '../models/userModel.js';
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const createToken = (id, role = "user") => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '5h' });
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, msg: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id, "user");

            // Exclude password
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email
            };

            res.json({ success: true, token, user: userData });
        } else {
            res.json({ success: false, msg: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, msg: error.message });
    }
};

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, msg: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, msg: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, msg: "Password should be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = createToken(user._id, "user");

        // Exclude password
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        res.json({ success: true, token, user: userData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, msg: error.message });
    }
};
//Add getProfile and updateProfile in userController.js
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, bio, avatarSeed, avatarColors } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (avatarSeed) user.avatarSeed = avatarSeed;
    if (avatarColors) user.avatarColors = avatarColors;

    await user.save();

    res.json({ success: true, msg: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


export { loginUser, registerUser, getProfile, updateProfile };
