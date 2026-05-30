import User from "../models/User.js";

export const getProviderProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProviderProfile = async (req, res) => {
  try {
    const { bio, experience, skills } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (bio !== undefined) user.bio = bio;
    if (experience !== undefined) user.experience = experience;
    if (skills !== undefined) {
      
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      bio: updated.bio,
      experience: updated.experience,
      skills: updated.skills,
      isApproved: updated.isApproved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};