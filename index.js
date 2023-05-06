// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const {MongoClient}=require('mongodb');
// passport.use(new GoogleStrategy({
//     clientID: "618977742876-eamvvnlij47ubcul77muqu7j10gn16b8.apps.googleusercontent.com",
//     clientSecret: "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",
//     callbackURL: 'http://localhost:5000/auth/google/callback'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // add your code to handle the authentication callback
//   }
// ));
// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
//   });
  
// // initiate the authentication request
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// // handle the authentication callback
// app.get('/auth/google/callback',
//   passport.authenticate('google'),
//   function(req, res) {
//     res.redirect("/")
//    res.send("HEllo dear here is your successfully logged in details/---")}
// );
// const client = new MongoClient("mongodb+srv://ranjit:ranjit@cluster0.lfir6st.mongodb.net/hello");
// async function runDb(){
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("website").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// runDb()

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/app');
const app = express();
require('dotenv').config()
const cors=require('cors')

// Set up session middleware
app.use(cors({origin: 'http://localhost:3000'}))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // replace * with the domain name that you want to allow
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(session({
  secret: 'YOUR_SECRET_SESSION_KEY',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000*24*30 }
  
}));

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up view engine
// app.set('view engine', 'ejs');

// Set up routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
// Connect to MongoDB
  

mongoose.connect(process.env.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Configure passport with Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user

  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) {
    done(null, existingUser);
  } else {
    const newUser = new User({
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      profileImg:profile.photos[0].value,

    });
    await newUser.save();
   
    done(null, newUser);
  }
}));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
   

 

// Start server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
