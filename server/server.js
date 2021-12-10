'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username+psw
const session = require('express-session');
const {check, validationResult} = require('express-validator'); // validation middleware

const userDao = require('./user-dao');
const customerDao = require('./customer-dao');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id).then((user) => {
    done(null, user); // req.user
  })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {

  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated!' });
}

// enable sessions in Express
app.use(session({
  // set up here express-session
  secret: 'ajs5sd6f5sd6fiufadds8f9865d6fsgeifgefleids89fwu',
  resave: false,
  saveUninitialized: false,
}));

// init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());



/*** CUSTOMER APIs ***/

// GET /api/Domande/:id
app.get('/api/services/', async (req, res) => {
  try {
    const Services = await customerDao.listServices();
    res.json(Services);
  } catch(err) {
    res.status(500).end();
  }
});

// POST /api/request
app.post('/api/request/', [
    check('service').isLength({min: 1, max: 20}),
    check('date').isDate({format: 'DD-MM-YYYY', strictMode: true})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    try {
      const newId = await customerDao.addRequest(req.body.service, req.body.date);
      res.json(newId);
    }
    catch(err) {
      res.status(503).json({error: `Database error in request insert`});
    }
  }
);



/*** USER APIs ***/

// Login --> POST /sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {

    if (err)
      return next(err);

    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});


// Logout --> DELETE /sessions/current 
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', isLoggedIn, (req, res) => {

  res.status(200).json(req.user);

});


app.get('/api/user/:id', (req, res) => {

  try {
    userDao.getUserById(req.params.id).then((user) => {

      res.status(200).json(user);
    }).catch((err) => {

      res.status(503).json({});
    });
  } catch (err) {
    res.status(500).json(false);
  }

});


/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});