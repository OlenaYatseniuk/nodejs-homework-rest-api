import User from "../schemas/user.js";

export const registerNewUser = async (email, password, verificationToken) => {
  const foundUser = await User.findOne({ email });

  if (foundUser) {
    return false;
  }
  
  const newUser = new User({
    email,
    password: undefined,
    verificationToken,
  });

  await newUser.setPassword(password);
  await newUser.setAvatarUrl(email);
  return await User.create(newUser);
};

export const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ verificationToken, verify: false });

  if (!user) {
    return false;
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    { verificationToken: null, verify: true },
    { new: true }
  );
  return true;
};

export const loginUser = async (email, token) => {
  const user = await User.findOneAndUpdate({ email }, { token }, { new: true });
  return user;
};

export const logoutUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    return false;
  }
  return await User.findByIdAndUpdate(id, { token: null }, { new: true });
};

export const updateUserSubscription = async (id, subscription) => {
  return await User.findByIdAndUpdate(id, subscription, { new: true });
};
