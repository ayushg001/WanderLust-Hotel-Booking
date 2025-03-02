const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
.get(  userController.renderSignUpForm)
.post(  wrapAsync(userController.signup));

router.route("/login")
.get(  userController.renderLogInForm  )
.post( saveRedirectUrl,                   //this will save the redirect-url into locals before the login
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 userController.Login
);


router.get("/logout" , userController.Logout  );

module.exports = router;
