const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig')

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: { 
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) => {
    if (created) {
      // if created, success and redirect to home
      console.log(`${user.name} was created`);
      passport.authenticate('local', {
        //flash message
        successRedirect: '/',
        successFlash: 'Account created and logging in'
      }) (req, res);
      res.redirect('/');
    } else {
      // Email already exist
      console.log('Email already exist');
      req.flash('Email already exists. Please try again')
      res.redirect('/auth/signup');
    }
  })
  .catch(error => {
    console.log('Error', error);
    req.flash(`Error, unfortunately... ${error}`)
    res.redirect('/auth/signup');
  });
});

//flash message
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back',
  failureFlash: 'Either password or email is incorrect. Please try again'
}));

router.post('/login', (req, res) => {

})

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('See you soon. Logging out.')
  res.redirect('/');
})

module.exports = router;