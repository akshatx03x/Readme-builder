import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { name, email, phoneNumber, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const newUser = new User({
        name,
        email,
        phoneNumber,
        avatar: avatar || "https://example.com/default-avatar.png",
      });
      await newUser.save();
      user = newUser;
    }
    user= user.toObject({getters:true})
    const token = jwt.sign(user, process.env.JWT_SECRET)
    res.cookie("access.token", token, {
        httpOnly: true,

    })

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
 