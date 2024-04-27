const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const authController = require("../controller/auth");

router
  .route("/register")
  .get(authController.getRegister)
  .post(wrapAsync(authController.createRegister));

router
  .route("/login")
  .get(authController.getLogin)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: {
        type: "error_msg",
        msg: "Invalid username or Password",
      },
    }),
    authController.authLogin
  );

router.post("/logout", authController.logout);

module.exports = router;
