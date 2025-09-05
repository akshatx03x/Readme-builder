import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
export const manualLogin = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Signup
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: fullName, // make sure your User model has "name"
        email,
        password: hashedPassword,
        provider: "manual",
        avatar: "https://example.com/default-avatar.png",
      });
    } else {
      // Login
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, user, token });
  } catch (error) {
    console.error("❌ Manual login error backend:", error); // <--- important
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { name, email, phoneNumber, avatar, provider, githubToken, password } = req.body;

    let user = await User.findOne({ email }).select(provider === "manual" ? "+password +githubToken" : "+githubToken");

    if (!user) {
      if (provider === "manual") {
        if (!password) {
          return res.status(400).json({ message: "Password is required for manual signup" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name,
          email,
          phoneNumber,
          avatar: avatar || "https://example.com/default-avatar.png",
          provider: "manual",
          password: hashedPassword,
          githubToken: null,
        });
        await newUser.save();
        user = newUser;
      } else {
        const newUser = new User({
          name,
          email,
          phoneNumber,
          avatar: avatar || "https://example.com/default-avatar.png",
          provider: provider || "google",
          githubToken: githubToken || null,
        });
        await newUser.save();
        user = newUser;
      }
    } else {
      if (provider === "manual") {
        if (!password) {
          return res.status(400).json({ message: "Password is required for manual login" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      } else {
        if (githubToken) {
          user.githubToken = githubToken;
          await user.save();
        }
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

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


export const getUser = async (req, res) => {
  try {
    const token = req.cookie.access_token;

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  const user = jwt.verify(token, process.env.JWT_SECRET)
  res.status(200).json({})  
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    })
  }}
  
  // ... existing imports and functions ...

// Fetch GitHub repos of logged-in user
export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getRepos = async (req, res) => {
  try {
    // 1. Get JWT from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user with GitHub token
    const user = await User.findById(decoded.id).select("+githubToken");
    if (!user || !user.githubToken) {
      return res.status(400).json({
        success: false,
        message: "No GitHub token available. Please log in with GitHub.",
      });
    }

    // 4. Call GitHub API
    const response = await fetch("https://api.github.com/user/repos?type=all", {
      headers: { Authorization: `token ${user.githubToken}` },
    });

    const repos = await response.json();

    // 5. Send simplified repo data to frontend
    res.status(200).json({
      success: true,
      repos: repos.map((repo) => ({
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        url: repo.html_url,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching repos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

