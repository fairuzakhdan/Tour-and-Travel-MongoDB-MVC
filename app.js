const express = require("express");
const ejsMate = require('ejs-mate')
const path = require("path");
const session = require('express-session')
const flash = require('connect-flash');
const app = express();
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const ErrorHandler = require('./utils/ErrorHandler');
const port = 3000;
const placeRouter = require('./routes/places')
const reviewRouter = require('./routes/reviews')
const User = require('./models/user')
const authRouter = require('./routes/auth')

mongoose
  .connect("mongodb://127.0.0.1:27017/bestPoints")
  .then((result) => {
    console.log("database connect");
  })
  .catch((err) => {
    console.log("database tidak connect", err);
  });

app.set("view-engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded( {extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
  secret: 'this-is-a-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
  res.locals.currentUser = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})


app.get("/", async (req, res) => {
  res.render("home.ejs");
});

app.use('/places', placeRouter);
app.use('/', authRouter)
app.use('/places/:idPlace/reviews', reviewRouter)


app.all('*', (req, res,next) => {
  next(new ErrorHandler('Page Not Found', 404))
})

app.use((err,req,res,next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('places/error.ejs', {err})
})

app.listen(port, () => {
  console.log(`server berjalan pada http://localhost:${port}`);
});
