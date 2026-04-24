import User from "../models/User.js";

export const updateUser = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};