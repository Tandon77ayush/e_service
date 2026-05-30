import User from "../models/User.js";


export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { bio, experience, skills } = req.body;

    user.bio = bio || user.bio;
    user.experience = experience || user.experience;
    user.skills = skills || user.skills;

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};