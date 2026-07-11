/**
 * File: server/middleware/auth.js
 * Description: Developer authentication middleware that automatically syncs and uses
 *              a default local developer profile for local development/testing.
 */

const User = require('../models/User');



// Mock JWT verification middleware that passes control to the next handler
const checkJwt = (req, res, next) => {
  next();
};

// Syncs mock user into the MongoDB users collection and sets req.mongoUser
const syncUser = async (req, res, next) => {
  try {
    const auth0Id = 'mock|1234567890';
    const email = 'developer@example.com';
    const name = 'Mock Developer';
    const picture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({
        auth0Id,
        email,
        name,
        picture
      });
      await user.save();
      console.log(`Saved default developer user to MongoDB: ${email}`);
    }

    req.mongoUser = user;
    next();
  } catch (error) {
    console.error('Error in syncUser middleware:', error);
    res.status(500).json({ message: 'Internal server error during user synchronization' });
  }
};

module.exports = {
  checkJwt,
  syncUser
};
