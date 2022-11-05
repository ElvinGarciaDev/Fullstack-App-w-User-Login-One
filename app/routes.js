module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('orders').find().toArray((err, result) => {


          if (err) return console.log(err)
          res.render('profile.ejs', {
            pizzaOrders: result,
            user : req.user // Send the email. This will help us only show the post made by a particular email
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    // Post request when user submits a budget
    app.post('/placeOrder', (req, res) => {
        console.log(req.body.pizza)
        // Passing Email: req.user.local.email so that the email of the logged in user can be saved to the collection. This will help us only show the post made by this email address
      db.collection('orders').insertOne({Name: req.body.pizza[0], Crust: req.body.pizza[1], Size: req.body.pizza[2], Toppings: req.body.pizza[3], Complete: "false", Email: req.user.local.email}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log(req.user.local.email)
        res.redirect('/profile')
      })
    })

    app.put('/updateComplete', (req, res) => {
        console.log(req.body)
      db.collection('orders')
      .findOneAndUpdate({Name: req.body.Name}, {
        $set: {
          Complete: req.body.true
        }
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })


    app.delete('/deleteOrder', (req, res) => {
      db.collection('orders').findOneAndDelete({Name: req.body.Name}, (err, result) => {
        if (err) return res.send(500, err)
        res.redirect('/profile')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}