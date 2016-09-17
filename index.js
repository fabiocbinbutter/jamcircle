
const express = require('express');
const http=require('http');
const path = require('path');
//const favicon = require('static-favicon');
//const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
const graph = require('fbgraph')
const fs=require('fs');
const app = express();
const host = "dev.tamanin.com"
const port = process.env.PORT || 3000;
const env=process.env.NODE_ENV || 'prod';
const fbAuthPath='/auth/facebook';


const conf = {
		  client_id:      '1419234001659548'
		, client_secret:  fs.readFileSync('secret/fbAppSecret.txt')
		, scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
		, redirect_uri:   'http://'+host+':'+port+fbAuthPath
	};

// Configuration

//app.use(bodyParser);
app.use(express.static(__dirname + '/static'));

"dev"==env && app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));



app.get(fbAuthPath, function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
	res.send(JSON.stringify(facebookRes));
	//res.redirect('/UserHasLoggedIn');
  });


});


// user gets sent here after being authorized
app.get('/UserHasLoggedIn', function(req, res) {
  res.render("index", { title: "Logged In" });
});



app.listen(port, function() {
  console.log("Express server listening on port %d", port);
});
