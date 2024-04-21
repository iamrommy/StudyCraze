const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const User = require('../models/User');
const Profile = require('../models/Profile');

require('dotenv').config();

const connectPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try{
          let user = await User.findOne({ //user comes here to signup or login
            googleId: profile.id,
          });
          // console.log(profile);
          
          const normalUser = await User.findOne({ //check whether user is making a new google account even if it has a normal account
            email: profile.email
          });
          if(!user && normalUser?.email){ //if the google account user doesn't exist but the normal user exist then convert it into google account
            console.log('This user already has an account without using google signup');
            // console.log(normalUser)
            normalUser.googleId = profile.id;
            normalUser.image = profile.photos[0].value;
            await normalUser.save();
            return done(null, normalUser);
          }

          if (!user) { //if the normal user doesn't exist and also the google user doesn't exist then create new account

            const profileDetails  = await Profile.create({
              gender: null,
              dateOfBirth: null,
              about: null,
              contactNumber: null
            });

            user = await User.create({ //new user
              googleId: profile.id,
              firstName: profile.given_name,
              lastName: profile.family_name,
              image: profile.photos[0].value,
              email: profile.email,
              additionalDetails: profileDetails,
            });

            console.log('user created');
            // console.log(user);
            return done(null, user);
          }

          else { //if the normal user doesn't exist and but the google user exist then sign in
            console.log('user already exists');
            // console.log(user);
            return done(null, user);
          }
        } 
        catch(error){
          console.log(error);
          console.error("Error in google Authentication", error.message);
          process.exit(1);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

module.exports = connectPassport