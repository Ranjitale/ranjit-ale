require('dotenv').config()
module.exports = {
    google: {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    mongodb: {
      connectionString:process.env.connectionString,
    },
  };
  