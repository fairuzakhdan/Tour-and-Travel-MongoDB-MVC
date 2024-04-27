const User = require('../models/user')

const getRegister = async (req, res) => {
    res.render("auth/register.ejs");
  }

const createRegister = async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = new User({ username, email });
      const registerUser = await User.register(user, password);
      req.login(registerUser,function(err) {
        if(err) return next(err)
        req.flash("success_msg", "User has successfully registered");
        res.redirect("/places");
      })
    } catch (err) {
      req.flash("error_msg", err.message);
      res.redirect("/register");
    }
  }

const getLogin = (req, res) => {
    res.render("auth/login.ejs");
  }

  const authLogin = (req, res) => {
    req.flash('success_msg','you have successfully logged in')
    res.redirect('/login')
  }
  
  const logout = (req, res) => {
    req.logout(function(err) {
        if(err) {
            return next(err)
        }
        req.flash('success_msg','You are logged out');
        res.redirect('/places')
    })
}

  module.exports = { getRegister, createRegister, getLogin, authLogin, logout}