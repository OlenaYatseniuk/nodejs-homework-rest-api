import User from "../schemas/user.js";

export const registerNewUser = async (email, password) => {
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return false;
  }

  const newUser = new User({
    email,
    password: undefined,
  });

  await newUser.setPassword(password);
  await newUser.setAvatarUrl(email);
  return await User.create(newUser);
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
