'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const passport = require('passport');
const { check, validationResult } = require('express-validator'); // validation middleware
const LocalStrategy = require('passport-local').Strategy; // username+psw
const session = require('express-session');

const userDao = require('./user-dao');
const customerDao = require('./customer-dao');
const service_typeDao = require('./service_type-dao');
const queueDao = require('./queue-dao');

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

/*** QUEUE APIs */


app.get('/api/queue/lastserved', async (req, res) => {
  
  try {
    const queue = await queueDao.getServingTicket();
    res.json(queue);
  } catch (err) {   
    res.status(500).end();
  }
});


app.get('/api/queue/next/:userID/:process', [
  check('userID').isNumeric(),
  check('process').isNumeric({min:0, max:1})
], async (req, res) => {

  const user = await userDao.getUserById(req.params.userID);

  try {
    const nextCLient = await queueDao.getNextClient(user, req.params.process);
    res.json({ticketID: nextCLient.ticketID, counterID: nextCLient.counterID});
  } catch (err) {
    res.status(500).end();
  }

});

app.get('/api/queue/:date', [
  check('date').isDate({ format: 'DD-MM-YYYY', strictMode: true })
], async (req, res) => {
  try {
    const queue = await queueDao.getQueue(req.params.date);
    res.json(queue);
  } catch (err) {
    res.status(500).end();
  }
});


/*** CUSTOMER APIs ***/

// GET /api/Domande/:id
app.get('/api/services/', async (req, res) => {
  try {
    const Services = await customerDao.listServices();
    res.json(Services);
  } catch (err) {
    res.status(500).end();
  }
});

// POST /api/request
app.post('/api/request/', [
  check('service').isLength({ min: 1, max: 20 }),
  check('date').isDate({ format: 'DD-MM-YYYY', strictMode: true })
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const newId = await customerDao.addRequest(req.body.service, req.body.date);
      res.json(newId);
    }
    catch (err) {
      res.status(503).json({ error: `Database error in request insert` });
    }
  }
);

/*** SERVICE APIs ***/

// GET /:service_id/average_time
app.get('/api/:service_id/average_time', (req, res) => {
  try {
    service_typeDao.getTimeForPerson(req.params.service_id).then((time) => {
      res.status(200).json(time);
    }).catch((err) => {
      res.status(503).json({});
    });
  } catch (err) {
    res.status(500).json(false);
  }
});

// GET /:service_id/number_of_people_in_queue
app.get('/api/number_of_people_in_queue', (req, res) => {
  try {
    service_typeDao.getNPeopleQueue(req.params.service_id).then((nperson) => {
      res.status(200).json(nperson);
    }).catch((err) => {
      res.status(503).json({});
    });
  } catch (err) {
    res.status(500).json(false);
  }
});

// GET /counter/counter_that_server_type/:service_id
app.get('/api/counter/counter_that_server_type/:service_id', (req, res) => {
  try {
    service_typeDao.getNDifferentTypeForCounter(req.params.service_id).then((counters) => {
      res.status(200).json(counters);
    }).catch((err) => {
      res.status(503).json({});
    });
  } catch (err) {
    res.status(500).json(false);
  }
});


/*** COUNTER APIs ***/

// GET /counter/counter_services
app.get('/api/counter_service', (req, res) => {
  try {
    service_typeDao.getCounterServices().then((counters) => {
      res.status(200).json(counters);
    }).catch((err) => {
      res.status(503).json([]);
    });
  } catch (err) {
    res.status(500).json([]);
  }
});



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