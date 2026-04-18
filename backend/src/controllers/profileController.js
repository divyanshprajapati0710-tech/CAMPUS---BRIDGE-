import User from "../models/User.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, department, semester, rollNo, skills } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.department = department || user.department;
      user.semester = semester || user.semester;
      user.rollNo = rollNo || user.rollNo;
      user.skills = skills || user.skills;
      user.profileComplete = true;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        semester: updatedUser.semester,
        rollNo: updatedUser.rollNo,
        skills: updatedUser.skills,
        employabilityScore: updatedUser.employabilityScore,
        profileComplete: updatedUser.profileComplete,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};