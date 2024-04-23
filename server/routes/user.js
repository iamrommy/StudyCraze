// Import the required modules
const express = require("express");
const router = express.Router();
const passport = require("passport");
const JWT = require('jsonwebtoken')

// Import the required controllers and middleware functions
const {
  logIn,
  signUp,
  sendOTP,
  changePassword,
  setUserAccountType
} = require("../controllers/Authentication");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");

const { autherization } = require("../middlewares/Autherization");
const User = require("../models/User");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", logIn);

// // Route for user signup
router.post("/signup", signUp);

// // Route for sending OTP to the user's email
router.post("/sendotp", sendOTP);

// // Route for Changing the password
router.post("/changepassword", autherization, changePassword);

// Google login
router.get("/googlelogin", passport.authenticate("google", {
      scope: ["profile", "email"],
      successRedirect: 'googlelogin/callback' 
  })
);

router.get("/googlelogin/callback", async(req, res)=>{
  // console.log('user' ,req.user)
    let user = req.user;

    user = await User.findById(user._id).populate('additionalDetails');

    // console.log(user);
    const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
    };
    const token = JWT.sign(payload, process.env.JWT_SECRET, {
        // expiresIn: "3h",
    });

    //create cookie
    const options = {
        // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        // httpOnly: false,
        // secure: true,
        // sameSite: 'None',
        // domain: '.studycraze.vercel.app'
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none"
    };

  //   res.cookie('token', token, options).status(200).json({
  //     success:true,
  //     token,
  //     newUser,
  //     message:'Signed up successfully'
  // });

    res.cookie('token', token, options);
    res.cookie('user', user, options);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/my-profile`);
});

router.post('/set-user-account-type', autherization, setUserAccountType);


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

// // Export the router for use in the main application
module.exports = router;
