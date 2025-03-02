const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router.get("/signup", userController.renderSignUpForm);

router.post(
  "/signup",
  wrapAsync(userController.signup)
);

router.get("/login", userController.renderLogInForm  );

router.post(
  "/login",
  saveRedirectUrl,                   //this will save the redirect-url into locals before the login
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 userController.Login
);

router.get("/logout" , userController.Logout  );

module.exports = router;
