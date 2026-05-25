const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelper');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'User already exists');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    sendSuccess(res, 201, 'User registered successfully', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resumeCount: user.resumeCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user._id);

    sendSuccess(res, 200, 'Login successful', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resumeCount: user.resumeCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    sendSuccess(res, 200, 'User details fetched', { user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    user.name = req.body.name || user.name;
    await user.save();

    sendSuccess(res, 200, 'Profile updated successfully', { user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return sendError(res, 401, 'Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
};
