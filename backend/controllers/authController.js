const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT and send cookie response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret_key_if_env_missing',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  const options = {
    expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false, // Set to false for development (localhost)
    sameSite: 'lax',
    path: '/'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      if (user.googleId && !user.password) {
        return res.status(400).json({ success: false, message: 'Account exists via Google Login. Try logging in with Google.' });
      }
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || 'user',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'User logged in via Google previously. Please use Google Login.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Google OAuth Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    console.log('\x1b[36m[Google Auth] Verifying token...\x1b[0m');
    console.log('\x1b[36m[Google Auth] Client ID:\x1b[0m', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
    
    // Verify token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { name, email, sub: googleId } = payload;

    console.log('\x1b[32m[Google Auth] Token verified for:\x1b[0m', email);

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      console.log('\x1b[36m[Google Auth] Existing user found\x1b[0m');
      // If user exists but no googleId, link the account
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
        console.log('\x1b[36m[Google Auth] Linked Google account\x1b[0m');
      }
    } else {
      console.log('\x1b[36m[Google Auth] Creating new user\x1b[0m');
      // Automatically register a new user
      user = await User.create({
        name,
        email,
        googleId,
        role: 'user'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('\x1b[31m[Google Auth Error]\x1b[0m', error.message);
    console.error('\x1b[31m[Google Auth Error Stack]\x1b[0m', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Google authentication failed', 
      error: error.message 
    });
  }
};
